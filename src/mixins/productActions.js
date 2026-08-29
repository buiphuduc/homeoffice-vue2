/**
 * src/mixins/productActions.js
 * ------------------------------------------------------------------
 * Nhiều view (Trang chủ, Danh mục, Yêu thích, Chi tiết sản phẩm) đều
 * cần 3 hành động giống hệt nhau: thêm vào giỏ, toggle yêu thích, mở
 * modal xem nhanh. Thay vì viết lại 3 hàm này ở từng view, gom vào 1
 * "mixin" rồi trộn vào view nào cần dùng (xem cách dùng ở cuối file).
 *
 * Nếu sau này bạn thấy hành vi "thêm vào giỏ" cần thay đổi (vd thêm
 * animation, thêm điều kiện kiểm tra tồn kho phức tạp hơn...), CHỈ SỬA
 * 1 CHỖ DUY NHẤT ở đây, mọi view dùng mixin này tự động cập nhật theo.
 * ------------------------------------------------------------------
 */
export default {
  data() {
    return {
      quickViewProduct: null,
    };
  },
  methods: {
    handleAddToCart(product, qty = 1, color = null) {
      this.$store.dispatch('cart/addItem', { product, qty, color });
      this.$store.dispatch('toast/push', {
        title: 'Đã thêm vào giỏ hàng',
        desc: color && color.name ? `${product.name} (${color.name})` : product.name,
      });
    },
    handleToggleWishlist(product) {
      const wasWished = this.$store.getters['wishlist/isWished'](product.id);
      this.$store.dispatch('wishlist/toggle', product.id);
      this.$store.dispatch('toast/push', {
        title: wasWished ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích',
        desc: wasWished ? '' : product.name,
      });
    },
    handleOpenQuickView(product) {
      this.quickViewProduct = product;
    },
    handleCloseQuickView() {
      this.quickViewProduct = null;
    },
  },
};
