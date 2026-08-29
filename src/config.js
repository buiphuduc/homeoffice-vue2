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
  zaloPhone: process.env.VUE_APP_ZALO_PHONE || '',
  messengerUsername: process.env.VUE_APP_MESSENGER_USERNAME || '',
  hotlineDisplay: process.env.VUE_APP_HOTLINE_DISPLAY || '',
  hotlineTel: process.env.VUE_APP_HOTLINE_TEL || '',

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
