<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header-main">
      <button
        class="mobile-nav-toggle"
        type="button"
        aria-label="Mở menu danh mục"
        @click="mobileNavOpen = !mobileNavOpen"
      >
        <i class="fa-solid" :class="mobileNavOpen ? 'fa-xmark' : 'fa-bars'"></i>
      </button>

      <router-link to="/" class="logo-link">
        <img class="logo" src="/images/logo.png"></img>
      </router-link>

      <div class="search-box">
        <form @submit.prevent="handleSearch">
          <input
            ref="searchInput"
            type="text"
            enterkeyhint="search"
            v-model="searchQuery"
            placeholder="Tìm sản phẩm..."
          >
          <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>

      <div class="header-actions">
        <router-link to="/yeu-thich" class="h-action">
          <i class="fa-regular fa-heart"></i>
          <span>Yêu thích</span>
          <span class="count" :class="{ 'is-bumping': wishlistBump }" v-if="wishlistCount">{{ wishlistCount }}</span>
        </router-link>

        <router-link to="/gio-hang" class="h-action">
          <i class="fa-solid fa-cart-shopping"></i>
          <span>Giỏ hàng</span>
          <span class="count" :class="{ 'is-bumping': cartBump }" v-if="cartCount">{{ cartCount }}</span>
        </router-link>
      </div>
    </div>

    <mega-menu :mobile-open="mobileNavOpen" @navigate="mobileNavOpen = false"></mega-menu>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import MegaMenu from './MegaMenu.vue';
import config from '@/config';

export default {
  name: 'AppHeader',
  components: { MegaMenu },
  data() {
    return {
      shopName: config.shopName,
      searchQuery: '',
      // Trạng thái đóng/mở của mega menu trên di động — điều khiển bởi nút
      // hamburger, truyền xuống MegaMenu.vue qua prop. Đóng lại tự động khi
      // người dùng bấm 1 link danh mục (xem sự kiện @navigate).
      mobileNavOpen: false,
      // true khi trang đã cuộn xuống 1 đoạn -> hiện bóng đổ dưới header,
      // giúp phân biệt header với nội dung đang đè lên nó (header sticky).
      isScrolled: false,
      // Bật/tắt animation "nảy" của badge số lượng trong ~350ms mỗi khi
      // số lượng giỏ hàng/yêu thích thay đổi (thêm/bớt sản phẩm).
      cartBump: false,
      wishlistBump: false,
    };
  },
  computed: {
    ...mapGetters('cart', { cartCount: 'count' }),
    ...mapGetters('wishlist', { wishlistCount: 'count' }),
  },
  watch: {
    // Đổi trang (route) bằng cách khác (vd bấm logo, gõ URL...) -> luôn đóng
    // menu di động lại, tránh trường hợp menu che mất nội dung trang mới.
    $route() {
      this.mobileNavOpen = false;
    },
    cartCount() {
      this.triggerBump('cartBump');
    },
    wishlistCount() {
      this.triggerBump('wishlistBump');
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('touchmove', this.handleTouchMove);
  },
  methods: {
    handleSearch() {
      const q = this.searchQuery.trim();
      if (!q) return;
      this.mobileNavOpen = false;
      this.$router.push({ name: 'search', query: { q } });
    },
    // Đang gõ tìm kiếm (bàn phím ảo mở) mà vuốt cuộn trang -> tự đóng bàn phím.
    // Trên iOS, cuộn nhanh khi bàn phím còn mở làm header sticky bị giật vì viewport
    // đang co giãn; đóng bàn phím lúc bắt đầu cuộn là cách xử lý gọn và quen thuộc nhất.
    handleTouchMove(e) {
      const input = this.$refs.searchInput;
      if (!input || document.activeElement !== input) return;
      if (e.target && e.target.closest && e.target.closest('.search-box')) return;
      input.blur();
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 8;
    },
    triggerBump(flag) {
      this[flag] = false;
      // Đợi 1 tick để Vue gỡ class ra rồi mới gắn lại -> animation chạy lại
      // được ngay cả khi số lượng đổi liên tiếp nhiều lần nhanh.
      this.$nextTick(() => {
        this[flag] = true;
        setTimeout(() => { this[flag] = false; }, 350);
      });
    },
  },
};
</script>
