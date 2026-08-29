<template>
  <div id="app">
    <toast-container></toast-container>
    <app-header></app-header>

    <div class="container">
      <div v-if="configWarning" class="config-warning">
        <i class="fa-solid fa-triangle-exclamation"></i> {{ configWarning }}
      </div>

      <div v-if="loadError" class="config-warning" style="background:#fbe7e2;border-color:#f3b7a6;">
        <i class="fa-solid fa-circle-exclamation"></i> {{ loadError }}
      </div>

      <router-view></router-view>
    </div>

    <app-footer></app-footer>
    <floating-actions></floating-actions>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import ToastContainer from '@/components/layout/ToastContainer.vue';
import FloatingActions from '@/components/layout/FloatingActions.vue';
import config from '@/config';

/**
 * App.vue là "khung xương" cố định của toàn bộ site: header, footer,
 * toast luôn hiển thị ở mọi trang; chỉ phần <router-view> thay đổi theo
 * URL. Đây cũng là nơi DUY NHẤT gọi các action "khởi động app" (tải sản
 * phẩm, khôi phục giỏ hàng/yêu thích từ localStorage) — chạy 1 lần khi
 * app mở lên, không lặp lại ở từng view.
 */
export default {
  name: 'App',
  components: { AppHeader, AppFooter, ToastContainer, FloatingActions },
  computed: {
    ...mapState('products', { loadError: (state) => state.error }),
    configWarning() {
      if (!config.sheetCsvUrl) {
        return 'Chưa cấu hình VUE_APP_SHEET_CSV_URL trong file .env — xem README.md để biết cách lấy link Google Sheet CSV.';
      }
      return '';
    },
  },
  async created() {
    // 1. Tải sản phẩm từ Google Sheet trước
    await this.$store.dispatch('products/fetchProducts');
    // 2. Sau khi CÓ sản phẩm rồi mới khôi phục giỏ hàng đã lưu (cần đối
    //    chiếu productId đã lưu với dữ liệu sản phẩm mới nhất)
    this.$store.dispatch('cart/restoreFromStorage');
    this.$store.dispatch('wishlist/restoreFromStorage');
  },
};
</script>
