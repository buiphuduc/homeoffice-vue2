<?php
/**
 * HTM Design & Build — API quản trị (PHP 8 + MySQL) chạy ngay trên hosting.
 * ----------------------------------------------------------------------
 * Lưu sản phẩm, dự án, tài khoản admin trong MySQL; ảnh lưu ở thư mục /uploads.
 * Gọi bằng: /api/index.php?r=<tên-chức-năng>
 *
 * BẢO MẬT:
 *  - Đọc dữ liệu công khai; GHI/XÓA/TẢI ẢNH chỉ khi đã đăng nhập.
 *  - Đăng nhập bằng cookie HttpOnly + SameSite=Strict, mật khẩu băm bằng bcrypt,
 *    giới hạn đăng nhập sai, mọi yêu cầu ghi phải có header X-Requested-With
 *    và cùng nguồn (Origin) chống CSRF.
 *  - Câu lệnh SQL luôn dùng tham số (chống SQL injection); ảnh được kiểm tra
 *    nội dung thật (không chỉ đuôi file), thư mục uploads không cho chạy PHP.
 * Cấu hình: sao chép config.sample.php -> config.php và điền thông tin MySQL.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function fail($msg, $code = 400, $extra = [])
{
    out(array_merge(['error' => $msg], $extra), $code);
}

$CONFIG = null;
set_exception_handler(function ($e) use (&$CONFIG) {
    error_log('[HTM API] ' . $e->getMessage());
    $debug = is_array($CONFIG) && !empty($CONFIG['debug']);
    fail($debug ? $e->getMessage() : 'Lỗi máy chủ. Hãy kiểm tra thông tin MySQL trong api/config.php.', 500);
});

if (PHP_VERSION_ID < 80000) {
    fail('Cần PHP 8.0 trở lên. Vào hPanel > Advanced > PHP Configuration để chọn PHP 8.1 hoặc mới hơn.', 500);
}

/* ------------------------------------------------------------------ cấu hình */
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    fail('Chưa có file api/config.php. Hãy sao chép config.sample.php thành config.php rồi điền thông tin MySQL.', 503, ['code' => 'no_config']);
}
$CONFIG = require $configFile;
foreach (['db_host', 'db_name', 'db_user', 'db_pass'] as $k) {
    if (!isset($CONFIG[$k])) {
        fail("File api/config.php thiếu mục '$k'.", 503, ['code' => 'bad_config']);
    }
}
$UPLOAD_DIR = rtrim($CONFIG['uploads_dir'] ?? (dirname(__DIR__) . '/uploads'), '/\\');
$UPLOAD_URL = rtrim($CONFIG['uploads_url'] ?? '/uploads', '/');

/* ------------------------------------------------------------------ CSDL */
try {
    $pdo = new PDO(
        'mysql:host=' . $CONFIG['db_host'] . ';dbname=' . $CONFIG['db_name'] . ';charset=utf8mb4',
        $CONFIG['db_user'],
        $CONFIG['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    error_log('[HTM API] DB: ' . $e->getMessage());
    fail('Không kết nối được MySQL. Kiểm tra lại db_host, db_name, db_user, db_pass trong api/config.php.', 503, ['code' => 'db_connect']);
}

function ensureSchema(PDO $pdo)
{
    $marker = __DIR__ . '/.schema_v2';
    if (is_file($marker)) {
        return;
    }
    $opts = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        sku VARCHAR(64) NOT NULL PRIMARY KEY,
        data LONGTEXT NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        updated_at DATETIME NOT NULL
    ) $opts");
    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        slug VARCHAR(100) NOT NULL PRIMARY KEY,
        data LONGTEXT NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        updated_at DATETIME NOT NULL
    ) $opts");
    // Tài khoản quản trị: đăng nhập bằng TÊN ĐĂNG NHẬP; role 'it' (duy nhất 1 tài khoản, được quản lý tài khoản)
    // hoặc 'editor' (nhân viên: chỉ quản lý sản phẩm/dự án)
    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(40) NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'editor',
        created_at DATETIME NOT NULL,
        UNIQUE KEY uq_admin_username (username)
    ) $opts");
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin_tokens (
        token_hash CHAR(64) NOT NULL PRIMARY KEY,
        admin_id INT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL,
        KEY idx_tok_admin (admin_id),
        KEY idx_tok_exp (expires_at)
    ) $opts");
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(64) NOT NULL,
        created_at DATETIME NOT NULL,
        KEY idx_att (ip, created_at)
    ) $opts");
    migrateAdmins($pdo);
    @file_put_contents($marker, (string) time());
}

/** Chuẩn hóa chuỗi thành tên đăng nhập hợp lệ (dùng khi nâng cấp từ bản cũ đăng nhập bằng email). */
function usernameFromText($text)
{
    $u = strtolower((string) $text);
    $u = preg_replace('/[^a-z0-9._-]+/', '.', $u);
    $u = trim($u, '._-');
    if (strlen($u) < 3) {
        $u = 'user' . $u;
    }
    return substr($u, 0, 32);
}

/** Nâng cấp bảng admins từ bản cũ (đăng nhập bằng email) lên bản dùng tên đăng nhập + vai trò. */
function migrateAdmins(PDO $pdo)
{
    $cols = array_column($pdo->query('SHOW COLUMNS FROM admins')->fetchAll(), 'Field');
    if (!in_array('username', $cols, true)) {
        $pdo->exec('ALTER TABLE admins ADD COLUMN username VARCHAR(40) NULL AFTER id');
    }
    if (!in_array('role', $cols, true)) {
        $pdo->exec("ALTER TABLE admins ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'editor'");
    }
    if (in_array('email', $cols, true)) {
        $pdo->exec('ALTER TABLE admins MODIFY email VARCHAR(190) NULL');
    }
    if (!$pdo->query("SHOW INDEX FROM admins WHERE Key_name = 'uq_admin_username'")->fetchAll()) {
        $pdo->exec('ALTER TABLE admins ADD UNIQUE KEY uq_admin_username (username)');
    }
    $rows = $pdo->query('SELECT * FROM admins ORDER BY id ASC')->fetchAll();
    $used = [];
    foreach ($rows as $r) {
        if (!empty($r['username'])) {
            $used[strtolower($r['username'])] = true;
        }
    }
    foreach ($rows as $r) {
        if (!empty($r['username'])) {
            continue;
        }
        $local = isset($r['email']) && strpos((string) $r['email'], '@') !== false ? strstr($r['email'], '@', true) : (string) ($r['email'] ?? 'admin');
        $base = usernameFromText($local);
        $name = $base;
        for ($i = 2; isset($used[$name]); $i++) {
            $name = substr($base, 0, 28) . $i;
        }
        $used[$name] = true;
        $pdo->prepare('UPDATE admins SET username = ? WHERE id = ?')->execute([$name, $r['id']]);
    }
    // Luôn có đúng 1 tài khoản IT: nếu chưa có thì tài khoản tạo đầu tiên là IT
    $hasIt = (int) $pdo->query("SELECT COUNT(*) FROM admins WHERE role = 'it'")->fetchColumn();
    if ($hasIt === 0) {
        $first = $pdo->query('SELECT id FROM admins ORDER BY id ASC LIMIT 1')->fetchColumn();
        if ($first) {
            $pdo->prepare("UPDATE admins SET role = 'it' WHERE id = ?")->execute([$first]);
        }
    }
}
ensureSchema($pdo);

/* ------------------------------------------------------------------ tiện ích */
function nowUtc($offsetSeconds = 0)
{
    return gmdate('Y-m-d H:i:s', time() + $offsetSeconds);
}

function isHttps()
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443);
}

function jsonBody()
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    if (strlen($raw) > 25 * 1024 * 1024) {
        fail('Dữ liệu gửi lên quá lớn.', 413);
    }
    $j = json_decode($raw, true);
    if (!is_array($j)) {
        fail('Dữ liệu gửi lên không hợp lệ.');
    }
    return $j;
}

function clientIp()
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 64);
}

/* ------------------------------------------------------------------ xác thực */
const COOKIE_NAME = 'htm_admin';
const SESSION_DAYS = 14;

function setAuthCookie($token, $expires)
{
    setcookie(COOKIE_NAME, $token, [
        'expires' => $expires,
        'path' => '/',
        'secure' => isHttps(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

function currentAdmin(PDO $pdo)
{
    static $cache = false;
    if ($cache !== false) {
        return $cache;
    }
    $cache = null;
    $token = $_COOKIE[COOKIE_NAME] ?? '';
    if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/', $token)) {
        return $cache;
    }
    $hash = hash('sha256', $token);
    $st = $pdo->prepare('SELECT a.id, a.username, a.role, t.expires_at FROM admin_tokens t JOIN admins a ON a.id = t.admin_id WHERE t.token_hash = ? AND t.expires_at > ?');
    $st->execute([$hash, nowUtc()]);
    $row = $st->fetch();
    if ($row) {
        $cache = ['id' => (int) $row['id'], 'username' => $row['username'], 'role' => $row['role'], 'hash' => $hash];
        // gia hạn phiên khi còn dưới 7 ngày
        if (strtotime($row['expires_at'] . ' UTC') - time() < 7 * 86400) {
            $exp = time() + SESSION_DAYS * 86400;
            $pdo->prepare('UPDATE admin_tokens SET expires_at = ? WHERE token_hash = ?')->execute([nowUtc(SESSION_DAYS * 86400), $hash]);
            setAuthCookie($token, $exp);
        }
    }
    return $cache;
}

function requireAdmin(PDO $pdo)
{
    $a = currentAdmin($pdo);
    if (!$a) {
        fail('Bạn chưa đăng nhập hoặc phiên đã hết hạn.', 401);
    }
    return $a;
}

function requireIT(PDO $pdo)
{
    $a = requireAdmin($pdo);
    if ($a['role'] !== 'it') {
        fail('Chỉ tài khoản IT mới được thực hiện thao tác này.', 403);
    }
    return $a;
}

function startSession(PDO $pdo, $adminId)
{
    $token = bin2hex(random_bytes(32));
    $pdo->prepare('INSERT INTO admin_tokens (token_hash, admin_id, expires_at, created_at) VALUES (?,?,?,?)')
        ->execute([hash('sha256', $token), $adminId, nowUtc(SESSION_DAYS * 86400), nowUtc()]);
    $pdo->prepare('DELETE FROM admin_tokens WHERE expires_at < ?')->execute([nowUtc()]);
    setAuthCookie($token, time() + SESSION_DAYS * 86400);
}

/** Tên đăng nhập: 3–32 ký tự, chữ thường không dấu, số, dấu . _ - (bắt đầu bằng chữ hoặc số). */
function cleanUsername($u)
{
    return strtolower(trim((string) $u));
}

function validUsername($u)
{
    return is_string($u) && (bool) preg_match('/^[a-z0-9][a-z0-9._-]{2,31}$/', $u);
}

function validPassword($pw)
{
    return is_string($pw) && strlen($pw) >= 8 && strlen($pw) <= 200;
}

/* ------------------------------------------------------------------ chống CSRF cho yêu cầu ghi */
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$route = isset($_GET['r']) ? (string) $_GET['r'] : '';
if ($method !== 'GET' && $method !== 'HEAD') {
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'htm-admin') {
        fail('Yêu cầu không hợp lệ.', 403);
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $oh = parse_url($origin, PHP_URL_HOST);
        $oPort = parse_url($origin, PHP_URL_PORT);
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $originHost = $oh . ($oPort ? ':' . $oPort : '');
        if (strcasecmp($originHost, $host) !== 0) {
            fail('Yêu cầu không hợp lệ (khác nguồn).', 403);
        }
    }
}

/* ------------------------------------------------------------------ dữ liệu */
const PRODUCT_PUBLIC_FIELDS = [
    'SKU', 'Name', 'Categories', 'Regular price', 'Sale price', 'Images', 'Short description',
    'Description', 'In stock', 'In stock?', 'Published', 'Colors', 'Slug', 'Material', 'Length', 'Width',
    'Height', 'Warranty (months)', 'Delivery time', 'Rating', 'Review count',
];

function tableInfo($table)
{
    if ($table === 'products') {
        return ['table' => 'products', 'key' => 'sku', 'pattern' => '/^[A-Za-z0-9._-]{1,64}$/'];
    }
    return ['table' => 'projects', 'key' => 'slug', 'pattern' => '/^[a-z0-9]+(-[a-z0-9]+)*$/'];
}

function listRows(PDO $pdo, $name)
{
    $t = tableInfo($name);
    $key = $t['key'];
    $admin = currentAdmin($pdo);
    $full = $admin && isset($_GET['full']) && $_GET['full'] === '1';
    $keysOnly = isset($_GET['columns']) && $_GET['columns'] === $key;
    $rows = $pdo->query("SELECT $key AS k, data, sort_order FROM {$t['table']} ORDER BY sort_order ASC, $key ASC")->fetchAll();
    $res = [];
    foreach ($rows as $r) {
        if ($keysOnly) {
            $res[] = [$key => $r['k']];
            continue;
        }
        $data = json_decode($r['data'], true);
        if (!is_array($data)) {
            $data = [];
        }
        if ($name === 'products' && !$full) {
            $data = array_intersect_key($data, array_flip(PRODUCT_PUBLIC_FIELDS));
        }
        $res[] = [$key => $r['k'], 'data' => empty($data) ? new stdClass() : $data, 'sort_order' => (int) $r['sort_order']];
    }
    return $res;
}

function upsertRows(PDO $pdo, $name, $rows)
{
    $t = tableInfo($name);
    $key = $t['key'];
    if (!is_array($rows) || count($rows) > 300) {
        fail('Danh sách gửi lên không hợp lệ hoặc quá nhiều dòng (tối đa 300).');
    }
    $sql = "INSERT INTO {$t['table']} ($key, data, sort_order, updated_at) VALUES (?,?,?,?)
            ON DUPLICATE KEY UPDATE data = VALUES(data), sort_order = VALUES(sort_order), updated_at = VALUES(updated_at)";
    $st = $pdo->prepare($sql);
    $pdo->beginTransaction();
    try {
        foreach ($rows as $r) {
            $k = isset($r[$key]) ? (string) $r[$key] : '';
            if (!preg_match($t['pattern'], $k) || strlen($k) > ($key === 'sku' ? 64 : 100)) {
                throw new InvalidArgumentException("Mã/đường dẫn '$k' không hợp lệ.");
            }
            if (!isset($r['data']) || !is_array($r['data'])) {
                throw new InvalidArgumentException("Dữ liệu của '$k' không hợp lệ.");
            }
            $json = json_encode($r['data'] === [] ? new stdClass() : $r['data'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($json === false || strlen($json) > 3 * 1024 * 1024) {
                throw new InvalidArgumentException("Dữ liệu của '$k' quá lớn hoặc sai định dạng.");
            }
            $so = isset($r['sort_order']) ? (int) $r['sort_order'] : 0;
            $st->execute([$k, $json, $so, nowUtc()]);
        }
        $pdo->commit();
    } catch (InvalidArgumentException $e) {
        $pdo->rollBack();
        fail($e->getMessage());
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

/* ------------------------------------------------------------------ tệp ảnh */
const FOLDER_RE = '/^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+){0,3}$/';
const FILEPATH_RE = '/^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+){0,3}\/[A-Za-z0-9._-]+$/';

function ensureUploadsRoot($dir)
{
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
        fail('Không tạo được thư mục uploads. Kiểm tra quyền ghi của hosting.', 500);
    }
    $ht = $dir . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "Options -Indexes -ExecCGI\n<FilesMatch \"\\.(php|phtml|phar|php[0-9]|pl|py|cgi|sh)$\">\n  Require all denied\n</FilesMatch>\nRemoveHandler .php .phtml\n");
    }
}

function handleUpload($uploadDir, $uploadUrl)
{
    if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
        fail('Không nhận được file ảnh.');
    }
    $f = $_FILES['file'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        $msg = ($f['error'] === UPLOAD_ERR_INI_SIZE || $f['error'] === UPLOAD_ERR_FORM_SIZE)
            ? 'Ảnh quá lớn so với giới hạn của hosting.' : 'Tải ảnh lên không thành công (mã ' . $f['error'] . ').';
        fail($msg);
    }
    if ($f['size'] > 20 * 1024 * 1024) {
        fail('Ảnh lớn hơn 20 MB.');
    }
    $folder = trim((string) ($_POST['folder'] ?? ''), '/');
    if (!preg_match(FOLDER_RE, $folder)) {
        fail('Thư mục không hợp lệ.');
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($f['tmp_name']);
    $extMap = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    if (!isset($extMap[$mime]) || @getimagesize($f['tmp_name']) === false) {
        fail('Chỉ nhận ảnh JPG, PNG, WebP hoặc GIF.');
    }
    $base = preg_replace('/[^A-Za-z0-9_-]+/', '-', pathinfo((string) ($_POST['name'] ?? $f['name']), PATHINFO_FILENAME));
    $base = trim(substr($base, 0, 80), '-');
    if ($base === '') {
        $base = 'img';
    }
    ensureUploadsRoot($uploadDir);
    $dir = $uploadDir . '/' . $folder;
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
        fail('Không tạo được thư mục lưu ảnh.', 500);
    }
    $name = $base . '.' . $extMap[$mime];
    if (is_file($dir . '/' . $name)) {
        $name = $base . '-' . substr(bin2hex(random_bytes(3)), 0, 5) . '.' . $extMap[$mime];
    }
    if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) {
        fail('Không lưu được file ảnh.', 500);
    }
    @chmod($dir . '/' . $name, 0644);
    return ['url' => $uploadUrl . '/' . $folder . '/' . $name, 'path' => $folder . '/' . $name];
}

function deleteFiles($uploadDir, $paths)
{
    $root = realpath($uploadDir);
    if ($root === false || !is_array($paths)) {
        return 0;
    }
    $n = 0;
    foreach (array_slice($paths, 0, 500) as $p) {
        if (!is_string($p) || !preg_match(FILEPATH_RE, $p)) {
            continue;
        }
        $real = realpath($uploadDir . '/' . $p);
        if ($real === false || strpos($real, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($real)) {
            continue;
        }
        if (@unlink($real)) {
            $n++;
            $d = dirname($real);
            while ($d !== $root && strpos($d, $root) === 0) { // dọn thư mục rỗng
                if (count(@scandir($d) ?: []) > 2 || !@rmdir($d)) {
                    break;
                }
                $d = dirname($d);
            }
        }
    }
    return $n;
}

/* ------------------------------------------------------------------ định tuyến */
switch ($route) {
    case 'status': {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
        $a = currentAdmin($pdo);
        out(['needs_setup' => $count === 0, 'user' => $a ? ['username' => $a['username'], 'role' => $a['role']] : null]);
    }

    case 'setup': { // tạo tài khoản IT (duy nhất) lần đầu — chỉ khi chưa có tài khoản nào
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        if ((int) $pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0) {
            fail('Đã có tài khoản quản trị. Hãy đăng nhập.', 403);
        }
        $b = jsonBody();
        $setupKey = (string) ($CONFIG['setup_key'] ?? '');
        if ($setupKey === '' || strlen($setupKey) < 8) {
            fail('Chưa đặt setup_key (ít nhất 8 ký tự) trong api/config.php.', 503, ['code' => 'no_setup_key']);
        }
        if (!hash_equals($setupKey, (string) ($b['key'] ?? ''))) {
            fail('Mã cài đặt không đúng (xem mục setup_key trong api/config.php).', 403);
        }
        $username = cleanUsername($b['username'] ?? '');
        if (!validUsername($username)) {
            fail('Tên đăng nhập gồm 3–32 ký tự: chữ thường không dấu, số, dấu . _ - (vd: it.admin).');
        }
        if (!validPassword($b['password'] ?? '')) {
            fail('Mật khẩu cần ít nhất 8 ký tự.');
        }
        $pdo->prepare("INSERT INTO admins (username, password_hash, role, created_at) VALUES (?,?,'it',?)")
            ->execute([$username, password_hash($b['password'], PASSWORD_BCRYPT), nowUtc()]);
        startSession($pdo, (int) $pdo->lastInsertId());
        out(['ok' => true, 'username' => $username, 'role' => 'it']);
    }

    case 'login': {
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        $b = jsonBody();
        $ip = clientIp();
        $pdo->prepare('DELETE FROM login_attempts WHERE created_at < ?')->execute([nowUtc(-86400)]);
        $st = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND created_at > ?');
        $st->execute([$ip, nowUtc(-900)]);
        if ((int) $st->fetchColumn() >= 8) {
            fail('Đăng nhập sai quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.', 429);
        }
        $username = cleanUsername($b['username'] ?? '');
        $st = $pdo->prepare('SELECT id, password_hash, role FROM admins WHERE username = ?');
        $st->execute([$username]);
        $row = $st->fetch();
        // Tên đăng nhập không tồn tại: vẫn kiểm tra với 1 hash giả để thời gian phản hồi giống nhau
        $hash = $row ? $row['password_hash'] : '$2y$10$cOcxe7J6iY3KwfUE3rXmpOH8WtMZq3rMrHILTxGxcHzwRpm5G11LS';
        $ok = password_verify((string) ($b['password'] ?? ''), $hash) && $row;
        if (!$ok) {
            $pdo->prepare('INSERT INTO login_attempts (ip, created_at) VALUES (?,?)')->execute([$ip, nowUtc()]);
            fail('Tên đăng nhập hoặc mật khẩu không đúng.', 401);
        }
        $pdo->prepare('DELETE FROM login_attempts WHERE ip = ?')->execute([$ip]);
        startSession($pdo, (int) $row['id']);
        out(['ok' => true, 'username' => $username, 'role' => $row['role']]);
    }

    case 'logout': {
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        $a = currentAdmin($pdo);
        if ($a) {
            $pdo->prepare('DELETE FROM admin_tokens WHERE token_hash = ?')->execute([$a['hash']]);
        }
        setAuthCookie('', time() - 3600);
        out(['ok' => true]);
    }

    case 'products':
    case 'projects': {
        if ($method === 'GET') {
            out(listRows($pdo, $route));
        }
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        requireAdmin($pdo);
        $b = jsonBody();
        upsertRows($pdo, $route, $b['rows'] ?? []);
        out(['ok' => true]);
    }

    case 'products_delete':
    case 'projects_delete': {
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        requireAdmin($pdo);
        $name = $route === 'products_delete' ? 'products' : 'projects';
        $t = tableInfo($name);
        $b = jsonBody();
        $k = (string) ($b['key'] ?? '');
        if (!preg_match($t['pattern'], $k)) {
            fail('Mã không hợp lệ.');
        }
        $pdo->prepare("DELETE FROM {$t['table']} WHERE {$t['key']} = ?")->execute([$k]);
        out(['ok' => true]);
    }

    case 'upload': {
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        requireAdmin($pdo);
        out(handleUpload($UPLOAD_DIR, $UPLOAD_URL));
    }

    case 'files_delete': {
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        requireAdmin($pdo);
        $b = jsonBody();
        out(['deleted' => deleteFiles($UPLOAD_DIR, $b['paths'] ?? [])]);
    }

    case 'admins': { // danh sách / thêm tài khoản — CHỈ tài khoản IT
        $me = requireIT($pdo);
        if ($method === 'GET') {
            $rows = $pdo->query('SELECT id, username, role, created_at FROM admins ORDER BY id ASC')->fetchAll();
            foreach ($rows as &$r) {
                $r['id'] = (int) $r['id'];
                $r['me'] = $r['id'] === $me['id'];
            }
            out($rows);
        }
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        $b = jsonBody();
        $username = cleanUsername($b['username'] ?? '');
        if (!validUsername($username)) {
            fail('Tên đăng nhập gồm 3–32 ký tự: chữ thường không dấu, số, dấu . _ - (vd: mkt01).');
        }
        if (!validPassword($b['password'] ?? '')) {
            fail('Mật khẩu cần ít nhất 8 ký tự.');
        }
        $st = $pdo->prepare('SELECT id FROM admins WHERE username = ?');
        $st->execute([$username]);
        if ($st->fetch()) {
            fail('Tên đăng nhập này đã có.');
        }
        // Tài khoản tạo thêm luôn là "editor" (không thể tạo thêm tài khoản IT)
        $pdo->prepare("INSERT INTO admins (username, password_hash, role, created_at) VALUES (?,?,'editor',?)")
            ->execute([$username, password_hash($b['password'], PASSWORD_BCRYPT), nowUtc()]);
        out(['ok' => true]);
    }

    case 'admins_delete': {
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        $me = requireIT($pdo);
        $b = jsonBody();
        $id = (int) ($b['id'] ?? 0);
        $st = $pdo->prepare('SELECT role FROM admins WHERE id = ?');
        $st->execute([$id]);
        $target = $st->fetch();
        if (!$target) {
            fail('Không tìm thấy tài khoản.', 404);
        }
        if ($id === $me['id'] || $target['role'] === 'it') {
            fail('Không thể xóa tài khoản IT.');
        }
        $pdo->prepare('DELETE FROM admin_tokens WHERE admin_id = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM admins WHERE id = ?')->execute([$id]);
        out(['ok' => true]);
    }

    case 'admins_reset': { // IT đặt lại mật khẩu cho một tài khoản (khi nhân viên quên mật khẩu)
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        $me = requireIT($pdo);
        $b = jsonBody();
        $id = (int) ($b['id'] ?? 0);
        if ($id === $me['id']) {
            fail('Hãy dùng mục "Đổi mật khẩu của tôi" cho tài khoản IT.');
        }
        if (!validPassword($b['password'] ?? '')) {
            fail('Mật khẩu mới cần ít nhất 8 ký tự.');
        }
        $st = $pdo->prepare('SELECT id FROM admins WHERE id = ?');
        $st->execute([$id]);
        if (!$st->fetch()) {
            fail('Không tìm thấy tài khoản.', 404);
        }
        $pdo->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([password_hash($b['password'], PASSWORD_BCRYPT), $id]);
        $pdo->prepare('DELETE FROM admin_tokens WHERE admin_id = ?')->execute([$id]); // buộc đăng nhập lại
        out(['ok' => true]);
    }

    case 'password': { // đổi mật khẩu của chính mình
        if ($method !== 'POST') {
            fail('Sai phương thức.', 405);
        }
        $me = requireAdmin($pdo);
        $b = jsonBody();
        $st = $pdo->prepare('SELECT password_hash FROM admins WHERE id = ?');
        $st->execute([$me['id']]);
        $row = $st->fetch();
        if (!$row || !password_verify((string) ($b['old'] ?? ''), $row['password_hash'])) {
            fail('Mật khẩu hiện tại không đúng.', 403);
        }
        if (!validPassword($b['new'] ?? '')) {
            fail('Mật khẩu mới cần ít nhất 8 ký tự.');
        }
        $pdo->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([password_hash($b['new'], PASSWORD_BCRYPT), $me['id']]);
        $pdo->prepare('DELETE FROM admin_tokens WHERE admin_id = ? AND token_hash <> ?')->execute([$me['id'], $me['hash']]);
        out(['ok' => true]);
    }

    default:
        fail('Không tìm thấy chức năng này.', 404);
}
