# Trang quản trị HTM trên Hostinger — hướng dẫn cài đặt (làm 1 lần)

Sau khi cài xong, bạn vào **`https://<tên-miền>/admin`**, đăng nhập và tự **thêm / sửa / xóa sản phẩm và dự án** (kèm tải ảnh lên). Thay đổi có hiệu lực **ngay, không cần build lại code**.

Mọi thứ nằm **ngay trên hosting Hostinger của bạn** (gói Business), không dùng dịch vụ bên ngoài:

| Dữ liệu | Lưu ở đâu |
|---|---|
| Sản phẩm, dự án, tài khoản admin | **MySQL** của Hostinger (tạo trong hPanel) |
| Ảnh tải lên | Thư mục **`public_html/uploads/`** |
| Phần xử lý (API) | Thư mục **`public_html/api/`** (PHP) |

> Nếu API chưa cài hoặc lỗi, website **tự dùng lại dữ liệu cũ** trong mã nguồn (`products.csv`, `projects.js`) nên shop không bao giờ bị trống.

---

## Bước 0 — Kiểm tra phiên bản PHP
hPanel → **Websites** → chọn website → **Advanced → PHP Configuration** → chọn **PHP 8.1 trở lên** (khuyến nghị 8.2/8.3). Các tiện ích **pdo_mysql, fileinfo, mbstring** thường đã bật sẵn.

## Bước 1 — Build và upload website
1. Trên máy bạn: `npm run build`.
2. hPanel → **File Manager** → `public_html` → upload **toàn bộ nội dung bên trong thư mục `dist/`** (nhớ bật hiển thị file ẩn để có `.htaccess`). Trong đó có sẵn thư mục `api/` và `uploads/`.

## Bước 2 — Tạo cơ sở dữ liệu MySQL
1. hPanel → **Databases → Management**.
2. Mục “Create a New MySQL Database And Database User”: nhập tên database, tên user, **mật khẩu** → **Create**.
3. **Ghi lại 3 thứ**: tên database, tên user (Hostinger tự thêm tiền tố dạng `u123456789_`), mật khẩu.
   (Không cần tạo bảng — API tự tạo bảng ở lần chạy đầu tiên.)

## Bước 3 — Tạo file cấu hình `api/config.php`
1. File Manager → `public_html/api/` → bấm chuột phải **`config.sample.php` → Copy/Rename thành `config.php`**.
2. Mở `config.php` để sửa:
   - `db_host`: để `localhost`
   - `db_name`, `db_user`, `db_pass`: điền 3 thông tin ở Bước 2
   - `setup_key`: tự đặt **một mã bí mật** (ít nhất 8 ký tự, khó đoán) — dùng 1 lần ở bước sau
3. Lưu lại. **Không chia sẻ file này cho ai và không đưa lên GitHub.**

## Bước 4 — Tạo tài khoản quản trị đầu tiên
1. Mở `https://<tên-miền>/admin`. Vì chưa có tài khoản nào nên trang hiện form **“Tạo tài khoản quản trị đầu tiên”**.
2. Nhập `setup_key` (ở Bước 3), email và mật khẩu (ít nhất 8 ký tự) → **Tạo tài khoản**. Bạn được đăng nhập luôn.
   Sau khi có tài khoản, `setup_key` không còn tác dụng.

## Bước 5 — Nhập dữ liệu có sẵn (1 lần)
Tab **Công cụ** → bấm **Nhập sản phẩm từ file CSV** và **Nhập 3 dự án mẫu**. Từ đây sửa mọi thứ ở tab **Sản phẩm** và **Dự án**.

## Bước 6 — Tạo tài khoản cho marketing
Tab **Tài khoản → Thêm tài khoản**: nhập email + mật khẩu cho từng người (mỗi người một tài khoản riêng), gửi mật khẩu qua kênh riêng tư và nhắc họ đổi mật khẩu sau khi đăng nhập (cùng tab Tài khoản).

---

## Dùng hằng ngày
- **Sản phẩm:** “+ Thêm sản phẩm” → mã (SKU), tên, danh mục (VD `Phòng Ngủ > Giường Ngủ`), giá (để trống = hiện “Liên hệ”), mô tả, **tải ảnh lên** (kéo thả được; ảnh đầu là ảnh chính) → Lưu. Công tắc “Hiển thị” để ẩn/hiện nhanh; “Nhân bản” để tạo sản phẩm tương tự.
- **Dự án:** “+ Thêm dự án” → thông tin, ảnh bìa, câu chuyện, rồi thêm từng **không gian** (phòng khách, phòng ngủ…) kèm ảnh và chọn bố cục.
- **Ảnh** được tự thu nhỏ (cạnh dài tối đa 1920px) và nén trước khi tải lên để website nhanh.

## Bảo mật (đã làm sẵn)
- Chỉ người đăng nhập mới thêm/sửa/xóa/tải ảnh được; khách chỉ xem.
- Mật khẩu được băm (bcrypt); đăng nhập bằng cookie HttpOnly, SameSite=Strict, tự gia hạn; đăng nhập sai quá 8 lần sẽ bị khóa 15 phút.
- Chống giả mạo yêu cầu (CSRF), chống SQL injection (câu lệnh tham số hóa), ảnh được kiểm tra nội dung thật; thư mục `uploads` **không cho chạy PHP**.
- **Hãy dùng mật khẩu mạnh** và truy cập qua **HTTPS**. Dùng **một tên miền duy nhất** (chọn có hoặc không có `www` và chuyển hướng cái còn lại) để phiên đăng nhập không bị lệch.

## Sao lưu
- Tab **Công cụ → Tải bản sao lưu (.json)**: chứa toàn bộ sản phẩm và dự án.
- **Ảnh** nằm ở `public_html/uploads/` — tải thư mục này về định kỳ (File Manager → Compress → Download), hoặc dùng **Backups** của hPanel (sao lưu cả website và MySQL).

## Khi cập nhật website (build lại)
Upload đè các file mới từ `dist/`. **KHÔNG xóa** thư mục `uploads/` và file `api/config.php` (chứa ảnh và thông tin MySQL). Đừng chọn kiểu “xóa hết rồi upload lại”.

## Gỡ lỗi thường gặp
| Hiện tượng | Cách xử lý |
|---|---|
| Trang `/admin` báo “Chưa có file api/config.php” | Làm Bước 3 (sao chép `config.sample.php` thành `config.php`) |
| “Không kết nối được MySQL” | Kiểm tra lại `db_name`, `db_user`, `db_pass` (nhớ tiền tố `u123456789_`) |
| “Lỗi máy chủ…” | Tạm đặt `'debug' => true` trong `config.php` để xem chi tiết, **xong nhớ tắt** |
| Mở `/admin` hoặc `/du-an/...` bị 404 | Thiếu file `.htaccess` ở `public_html` — upload lại (bật hiển thị file ẩn) |
| “API chưa hoạt động…” | Chưa upload thư mục `api/`, hoặc PHP chưa bật (Bước 0) |
| Tải ảnh lỗi | Kiểm tra thư mục `uploads` có quyền ghi (755); ảnh lớn hơn giới hạn PHP thì giảm dung lượng |
| Đăng nhập xong vẫn quay về màn đăng nhập | Đang vào bằng tên miền khác (www / không www) hoặc HTTP thay vì HTTPS |
| Quên mật khẩu | Nhờ admin khác đặt lại (hiện chỉ đổi được mật khẩu của chính mình). Nếu là admin duy nhất: vào hPanel → phpMyAdmin → bảng `admins` → xóa dòng của bạn **và** bảng `admin_tokens`, rồi mở `/admin` để tạo lại bằng `setup_key` |

## Lưu ý khác
- Sơ đồ trang `sitemap.xml` là file tĩnh: sản phẩm/dự án mới chưa có trong đó cho tới khi chạy lại `node scripts/generate-sitemap.js` và upload. Chỉ ảnh hưởng tốc độ Google tìm thấy trang, không ảnh hưởng hiển thị.
- Chạy thử trên máy cá nhân (`npm run serve`) **không có PHP** nên `/admin` sẽ báo chưa kết nối API và website dùng dữ liệu tĩnh. Hãy thử trang quản trị trên hosting.
