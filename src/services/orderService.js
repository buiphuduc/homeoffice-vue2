import config from '@/config';
import { formatVND } from '@/utils/format';

/**
 * src/services/orderService.js
 * ------------------------------------------------------------------
 * Vì dự án không có backend đặt hàng thật, "đặt hàng" ở đây nghĩa là:
 * (1) soạn sẵn nội dung đơn hàng dạng text dễ đọc,
 * (2) đưa khách tới Zalo/Messenger của shop kèm nội dung đã copy sẵn
 *     vào clipboard để họ chỉ cần dán vào khung chat.
 * Toàn bộ logic "soạn đơn" tập trung ở đây — nếu sau này bạn có backend
 * thật (vd nối lại WooCommerce hoặc API riêng), chỉ cần thêm 1 hàm mới
 * trong file này (vd submitOrderToApi()) mà không phải sửa các view.
 * ------------------------------------------------------------------
 */
export default {
  /**
   * Dựng nội dung đơn hàng dạng text để khách copy gửi qua Zalo/Messenger.
   * @param {object} params
   * @param {object} params.customer - {name, phone, address, note}
   * @param {Array<{product: object, qty: number}>} params.cartItems
   * @param {number} params.total
   * @returns {string}
   */
  buildOrderText({ customer, cartItems, total }) {
    const lines = [];
    lines.push(`ĐƠN HÀNG MỚI - ${config.shopName}`);
    lines.push('------------------------------');
    lines.push(`Khách hàng: ${customer.name}`);
    lines.push(`SĐT: ${customer.phone}`);
    lines.push(`Địa chỉ: ${customer.address}`);
    if (customer.note) lines.push(`Ghi chú: ${customer.note}`);
    lines.push('');
    lines.push('Sản phẩm:');
    cartItems.forEach((c) => {
      const colorLabel = c.color && c.color.name ? ` - Màu: ${c.color.name}` : '';
      lines.push(`- ${c.product.name}${colorLabel} (SKU: ${c.product.sku}) x${c.qty} = ${formatVND(c.product.effectivePrice * c.qty)}`);
    });
    lines.push('');
    lines.push(`TỔNG CỘNG: ${formatVND(total)}`);
    return lines.join('\n');
  },

  /** Link mở cửa sổ chat Zalo của shop */
  get zaloLink() {
    return `https://zalo.me/${config.zaloPhone}`;
  },

  /** Link mở cửa sổ chat Messenger của shop */
  get messengerLink() {
    return `https://m.me/${config.messengerUsername}`;
  },

  /**
   * Copy nội dung đơn hàng vào clipboard, có phương án dự phòng cho
   * trình duyệt cũ / trang không chạy trên HTTPS (Clipboard API yêu cầu HTTPS).
   * @param {string} text
   * @param {HTMLTextAreaElement} [fallbackTextareaEl] - phần tử textarea để chọn & copy dự phòng
   * @returns {Promise<boolean>} true nếu copy thành công
   */
  async copyToClipboard(text, fallbackTextareaEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // rơi xuống phương án dự phòng bên dưới
      }
    }
    if (fallbackTextareaEl) {
      fallbackTextareaEl.select();
      document.execCommand('copy');
      return true;
    }
    return false;
  },
};
