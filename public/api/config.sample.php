<?php
/**
 * Cấu hình API quản trị HTM.
 * CÁCH DÙNG: sao chép file này thành `config.php` (cùng thư mục) rồi điền thông tin.
 * KHÔNG đưa config.php lên GitHub / chia sẻ cho người khác.
 *
 * Lấy thông tin MySQL: hPanel -> Databases -> Management (MySQL Databases)
 * -> tạo database + user + mật khẩu.
 */
return [
    // --- MySQL (Hostinger: host thường là localhost) ---
    'db_host' => 'localhost',
    'db_name' => 'u123456789_htm',
    'db_user' => 'u123456789_htm',
    'db_pass' => 'MAT_KHAU_MYSQL',

    // Mã dùng 1 LẦN để tạo tài khoản admin đầu tiên (ít nhất 8 ký tự, tự đặt, khó đoán).
    // Sau khi tạo xong tài khoản đầu tiên, mã này không còn tác dụng.
    'setup_key' => 'DAT-MOT-MA-BI-MAT-O-DAY',

    // Thư mục lưu ảnh tải lên và đường dẫn công khai (thường không cần đổi)
    // 'uploads_dir' => __DIR__ . '/../uploads',
    // 'uploads_url' => '/uploads',

    // true = hiện chi tiết lỗi (chỉ bật khi cần chẩn đoán, xong nhớ tắt)
    'debug' => false,
];
