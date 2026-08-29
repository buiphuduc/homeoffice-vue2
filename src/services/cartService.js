import config from '@/config';

/**
 * src/services/cartService.js
 * ------------------------------------------------------------------
 * Lưu/đọc giỏ hàng vào localStorage của trình duyệt. Vì dự án này
 * không có backend, giỏ hàng chỉ tồn tại trên máy/trình duyệt hiện tại
 * của khách — đây là giới hạn đã được thống nhất trước (xem README).
 *
 * Chỉ lưu {productId, qty} — KHÔNG lưu toàn bộ object sản phẩm, vì giá/
 * ảnh sản phẩm có thể đã đổi trong Sheet từ lần trước khách ghé thăm.
 * Khi khôi phục giỏ hàng, store sẽ tự ghép lại với dữ liệu sản phẩm
 * MỚI NHẤT đang có trong bộ nhớ (xem store/modules/cart.js).
 * ------------------------------------------------------------------
 */
export default {
  /**
   * @param {Array<{productId: string, qty: number}>} simpleCart
   */
  save(simpleCart) {
    try {
      localStorage.setItem(config.cart.localStorageKey, JSON.stringify(simpleCart));
    } catch (e) {
      // localStorage có thể bị chặn (chế độ ẩn danh, cookie bị tắt...) -> bỏ qua an toàn
      console.warn('Không thể lưu giỏ hàng vào localStorage:', e);
    }
  },

  /**
   * @returns {Array<{productId: string, qty: number}>}
   */
  load() {
    try {
      const raw = localStorage.getItem(config.cart.localStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Không thể đọc giỏ hàng từ localStorage:', e);
      return [];
    }
  },

  clear() {
    try {
      localStorage.removeItem(config.cart.localStorageKey);
    } catch (e) {
      /* bỏ qua */
    }
  },
};
