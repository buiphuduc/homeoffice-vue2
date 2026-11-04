import config from '@/config';

/**
 * src/services/api.js
 * ------------------------------------------------------------------
 * Máy khách cho API quản trị chạy ngay trên hosting (PHP + MySQL, thư mục
 * public/api). Thay cho việc gọi dịch vụ bên ngoài:
 *  - Đọc sản phẩm/dự án công khai (website dùng).
 *  - Đăng nhập admin bằng cookie HttpOnly (trình duyệt tự gửi, JavaScript
 *    không đọc được -> an toàn hơn lưu token trong localStorage).
 *  - Ghi/xóa dữ liệu, tải ảnh lên, quản lý tài khoản (chỉ khi đã đăng nhập).
 * Chưa có API (vd chạy `npm run serve` trên máy cá nhân) -> isConfigured() = false
 * hoặc các hàm đọc báo lỗi để website tự dùng dữ liệu tĩnh như cũ.
 * ------------------------------------------------------------------
 */

const USER_KEY = 'htm_admin_user'; // chỉ lưu tên đăng nhập + vai trò để hiển thị (không phải mật khẩu/token)
let authLostHandler = null;

export function isConfigured() {
  return !!config.apiUrl;
}

function endpoint(r, params = {}) {
  const q = new URLSearchParams({ r, ...params });
  return `${config.apiUrl.replace(/\/$/, '')}/index.php?${q.toString()}`;
}

/* ---------- trạng thái đăng nhập (chỉ để hiển thị) ---------- */
function readUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; }
}
function writeUser(u) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch (e) { /* bỏ qua */ }
}
function clearUser() {
  try { localStorage.removeItem(USER_KEY); } catch (e) { /* bỏ qua */ }
}

export function getSession() { return readUser(); }
/** Đăng ký hàm được gọi khi phiên hết hạn (để quay lại màn đăng nhập). */
export function onAuthLost(fn) { authLostHandler = fn; }
function authLost() {
  clearUser();
  if (authLostHandler) authLostHandler();
}

/* ---------- gọi API ---------- */
async function call(r, {
  method = 'GET', body, params, form, authed = false,
} = {}) {
  const headers = { 'X-Requested-With': 'htm-admin' };
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(endpoint(r, params), {
      method, headers, body: payload, credentials: 'same-origin', cache: 'no-store',
    });
  } catch (e) {
    throw new Error('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
  }
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }

  if (!res.ok) {
    if (res.status === 401 && authed) authLost();
    const err = new Error((json && json.error) || `Lỗi máy chủ (${res.status}).`);
    err.status = res.status;
    err.code = json && json.code;
    throw err;
  }
  if (json === null && text) {
    const err = new Error('API chưa hoạt động trên địa chỉ này (không nhận được dữ liệu JSON).');
    err.code = 'no_api';
    throw err;
  }
  return json;
}

/* ---------- xác thực ---------- */
/** @returns {Promise<{needs_setup: boolean, user: {username: string, role: 'it'|'editor'}|null}>} */
export async function authStatus() {
  const s = await call('status');
  if (s.user) writeUser({ username: s.user.username, role: s.user.role }); else clearUser();
  return s;
}

export async function signIn(username, password) {
  const r = await call('login', { method: 'POST', body: { username, password } });
  writeUser({ username: r.username, role: r.role });
  return r;
}

/** Tạo tài khoản IT (duy nhất) lần đầu, cần mã cài đặt (setup_key) trong api/config.php. */
export async function setupFirstAdmin(key, username, password) {
  const r = await call('setup', { method: 'POST', body: { key, username, password } });
  writeUser({ username: r.username, role: r.role });
  return r;
}

export async function signOut() {
  clearUser();
  try { await call('logout', { method: 'POST' }); } catch (e) { /* đăng xuất cục bộ là đủ */ }
}

/* ---------- dữ liệu ---------- */
/**
 * Đọc bảng 'products' | 'projects'.
 * authed=true: lấy đủ mọi cột (dùng trong trang quản trị). Không có authed: chỉ
 * trả các cột website cần (bỏ prompt tạo ảnh, ghi chú nội bộ...).
 * columns='sku' / 'slug': chỉ lấy khóa (để đếm nhanh).
 */
export function select(table, { columns = '', authed = false } = {}) {
  const params = {};
  if (columns === 'sku' || columns === 'slug') params.columns = columns;
  if (authed) params.full = '1';
  return call(table, { params, authed });
}

/** Thêm mới hoặc cập nhật theo khóa chính. rows: [{ sku|slug, data, sort_order }] */
export function upsert(table, key, rows) {
  if (!rows.length) return Promise.resolve(null);
  return call(table, { method: 'POST', body: { rows }, authed: true });
}

export function remove(table, key, value) {
  return call(`${table}_delete`, { method: 'POST', body: { key: value }, authed: true });
}

/* ---------- ảnh ---------- */
/** Nếu url là ảnh trong kho của mình (/uploads/...) thì trả về đường dẫn trong kho, ngược lại ''. */
export function storagePathFromUrl(url) {
  if (!url) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const clean = url.indexOf(origin + '/uploads/') === 0 ? url.slice(origin.length) : url;
  if (clean.indexOf('/uploads/') !== 0) return '';
  return decodeURIComponent(clean.slice('/uploads/'.length));
}

/** Tải 1 ảnh lên thư mục trên hosting. path = 'thu-muc/ten-file.jpg'. Trả về URL công khai. */
export async function uploadFile(path, blob, contentType) {
  const i = path.lastIndexOf('/');
  const folder = i >= 0 ? path.slice(0, i) : 'misc';
  const file = path.slice(i + 1);
  const form = new FormData();
  form.append('folder', folder);
  form.append('name', file);
  form.append('file', blob, file);
  const r = await call('upload', { method: 'POST', form, authed: true });
  return r.url;
}

/** Xóa các file ảnh (danh sách đường dẫn trong kho). Lỗi bị bỏ qua (chỉ để dọn rác). */
export async function removeFiles(paths) {
  const list = (paths || []).filter(Boolean);
  if (!list.length) return;
  try { await call('files_delete', { method: 'POST', body: { paths: list }, authed: true }); } catch (e) { /* không quan trọng */ }
}

/* ---------- tài khoản quản trị (chỉ tài khoản IT dùng được listAdmins/addAdmin/removeAdmin/resetAdminPassword) ---------- */
export function listAdmins() { return call('admins', { authed: true }); }
export function addAdmin(username, password) { return call('admins', { method: 'POST', body: { username, password }, authed: true }); }
export function resetAdminPassword(id, password) { return call('admins_reset', { method: 'POST', body: { id, password }, authed: true }); }
export function removeAdmin(id) { return call('admins_delete', { method: 'POST', body: { id }, authed: true }); }
export function changePassword(oldPassword, newPassword) {
  return call('password', { method: 'POST', body: { old: oldPassword, new: newPassword }, authed: true });
}
