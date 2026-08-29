import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products';
import cart from './modules/cart';
import wishlist from './modules/wishlist';
import toast from './modules/toast';

Vue.use(Vuex);

/**
 * src/store/index.js
 * ------------------------------------------------------------------
 * Điểm gộp tất cả module Vuex lại. Dùng `namespaced: true` ở mỗi module
 * (xem trong từng file modules/*.js) nên khi gọi từ component luôn phải
 * ghi rõ tên module, ví dụ:
 *   this.$store.dispatch('cart/addItem', { product, qty })
 *   this.$store.getters['cart/total']
 * Cách này giúp tránh nhầm lẫn action/getter trùng tên giữa các module
 * khi dự án phát triển lớn hơn.
 * ------------------------------------------------------------------
 */
export default new Vuex.Store({
  modules: {
    products,
    cart,
    wishlist,
    toast,
  },
});
