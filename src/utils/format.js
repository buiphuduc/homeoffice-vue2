/**
 * src/utils/format.js
 * ------------------------------------------------------------------
 * Các hàm định dạng dùng ở nhiều component khác nhau. Tách riêng ra
 * đây để: (1) không lặp code, (2) dễ viết unit test riêng cho từng
 * hàm nếu sau này cần, (3) khi có bug định dạng giá/số, chỉ cần mở
 * đúng 1 file này.
 * ------------------------------------------------------------------
 */

/**
 * Định dạng số thành chuỗi tiền VNĐ, ví dụ: 2950000 -> "2.950.000 đ"
 * @param {number} amount
 * @returns {string}
 */
export function formatVND(amount) {
  const n = Number(amount) || 0;
  return Math.round(n).toLocaleString('vi-VN') + ' đ';
}

/**
 * Chuyển 1 chuỗi giá tiền bất kỳ (có thể có "đ", dấu chấm, khoảng trắng...)
 * về số nguyên thuần túy. Dùng khi đọc dữ liệu thô từ Google Sheet CSV,
 * vì người dùng có thể lỡ nhập "2.950.000 đ" thay vì "2950000".
 * @param {string|number} raw
 * @returns {number}
 */
export function parseVNDNumber(raw) {
  if (raw === null || raw === undefined || raw === '') return 0;
  const cleaned = String(raw).replace(/[^0-9.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Tính phần trăm giảm giá, ví dụ giá gốc 100, giá KM 90 -> trả về 10.
 * @param {number} regularPrice
 * @param {number} salePrice
 * @returns {number}
 */
export function calcDiscountPercent(regularPrice, salePrice) {
  if (!salePrice || !regularPrice || salePrice >= regularPrice) return 0;
  return Math.round((1 - salePrice / regularPrice) * 100);
}
