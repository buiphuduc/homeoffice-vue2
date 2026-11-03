/**
 * src/config.js
 * ------------------------------------------------------------------
 * TOÀN BỘ giá trị cấu hình của app tập trung ở 1 file này, lấy từ biến
 * môi trường (.env) — khi cần đổi link Google Sheet, số Zalo, tên shop...
 * chỉ cần sửa file .env, KHÔNG cần đụng vào bất kỳ file code nào khác.
 *
 * Đây là điểm khác biệt lớn so với bản 1-file HTML trước: cấu hình được
 * tách hẳn ra khỏi logic, đúng chuẩn các dự án thực tế.
 * ------------------------------------------------------------------
 */
export default {
  shopName: process.env.VUE_APP_SHOP_NAME || 'HTMVN Shop',
  sheetCsvUrl: process.env.VUE_APP_SHEET_CSV_URL || '',
  // API quản trị chạy ngay trên hosting (thư mục public/api: PHP + MySQL) — thêm/sửa/xóa
  // sản phẩm & dự án mà không cần build lại. Mặc định bản build production dùng '/api';
  // khi chạy `npm run serve` trên máy cá nhân (không có PHP) mặc định tắt, website dùng
  // dữ liệu tĩnh (products.csv, src/content/projects.js). Có thể đặt VUE_APP_API_URL để đổi.
  apiUrl: process.env.VUE_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : ''),
  zaloPhone: process.env.VUE_APP_ZALO_PHONE || '',
  messengerUsername: process.env.VUE_APP_MESSENGER_USERNAME || '',
  hotlineDisplay: process.env.VUE_APP_HOTLINE_DISPLAY || '',
  hotlineTel: process.env.VUE_APP_HOTLINE_TEL || '',
  // Domain thật khi lên production — dùng để tạo canonical link/sitemap
  // (xem src/utils/seo.js, scripts/generate-sitemap.js). Bỏ dấu / cuối.
  // Email nhận tin nhắn từ form Liên hệ (qua FormSubmit) — hiện là email TEST, đổi ở .env khi chính thức.
  // Xem hướng dẫn deploy đầy đủ trong file google-apps-script/Code.gs ở gốc repo.
  contactScriptUrl: process.env.VUE_APP_CONTACT_SCRIPT_URL || '',
  siteUrl: (process.env.VUE_APP_SITE_URL || 'https://htmvn.com').replace(/\/$/, ''),

  // Các hằng số hành vi của app — gom vào đây để dễ chỉnh cùng 1 chỗ
  cart: {
    localStorageKey: 'htmvn_cart',
  },
  wishlist: {
    localStorageKey: 'htmvn_wishlist',
  },
  listing: {
    pageSize: 12,
  },
};
