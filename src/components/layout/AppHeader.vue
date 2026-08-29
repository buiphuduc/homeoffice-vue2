<template>
  <header class="site-header">
    <div class="container header-main">
      <button
        class="mobile-nav-toggle"
        type="button"
        aria-label="Mở menu danh mục"
        @click="mobileNavOpen = !mobileNavOpen"
      >
        <i class="fa-solid" :class="mobileNavOpen ? 'fa-xmark' : 'fa-bars'"></i>
      </button>

      <router-link to="/" class="logo">
        <i class="fa-solid fa-chair"></i> {{ shopName }}
      </router-link>

      <div class="search-box">
        <form @submit.prevent="handleSearch">
          <input
            type="text"
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
          <span class="count" v-if="wishlistCount">{{ wishlistCount }}</span>
        </router-link>

        <router-link to="/gio-hang" class="h-action">
          <i class="fa-solid fa-cart-shopping"></i>
          <span>Giỏ hàng</span>
          <span class="count" v-if="cartCount">{{ cartCount }}</span>
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
  },
  methods: {
    handleSearch() {
      const q = this.searchQuery.trim();
      if (!q) return;
      this.mobileNavOpen = false;
      this.$router.push({ name: 'listing', query: { q } });
    },
  },
};
</script>
