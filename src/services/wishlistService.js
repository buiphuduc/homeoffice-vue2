import config from '@/config';

/**
 * src/services/wishlistService.js
 * ------------------------------------------------------------------
 * Tương tự cartService.js nhưng cho danh sách yêu thích. Chỉ lưu mảng
 * ID sản phẩm — logic đơn giản, tách riêng file để không trộn lẫn với
 * logic giỏ hàng (mỗi service chỉ lo 1 việc).
 * ------------------------------------------------------------------
 */
export default {
  /** @param {string[]} ids */
  save(ids) {
    try {
      localStorage.setItem(config.wishlist.localStorageKey, JSON.stringify(ids));
    } catch (e) {
      console.warn('Không thể lưu wishlist vào localStorage:', e);
    }
  },

  /** @returns {string[]} */
  load() {
    try {
      const raw = localStorage.getItem(config.wishlist.localStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Không thể đọc wishlist từ localStorage:', e);
      return [];
    }
  },
};
