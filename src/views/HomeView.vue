<template>
  <div>
    <!-- ===== HERO: 1 banner lớn + 2 banner nhỏ xếp chồng ===== -->
    <section class="hero-grid">
      <router-link :to="categoryLink(content.heroPrimary.ctaCategory)" class="hero-banner-card"
        :style="content.heroPrimary.image ? { backgroundImage: 'url(' + content.heroPrimary.image + ')' } : null">
        <div v-if="!content.heroPrimary.hasOwnText">
          <span class="tag">{{ content.heroPrimary.tag }}</span>
          <h1>{{ content.heroPrimary.title }}</h1>
          <p>{{ content.heroPrimary.desc }}</p>
          <span class="btn btn-accent">{{ content.heroPrimary.ctaText }} <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </router-link>

      <div class="hero-secondary-stack">
        <router-link
          v-for="(banner, i) in content.heroSecondary"
          :key="'hs' + i"
          :to="categoryLink(banner.ctaCategory)"
          class="hero-banner-card secondary"
          :style="banner.image ? { backgroundImage: 'url(' + banner.image + ')' } : null"
        >
          <div v-if="!banner.hasOwnText">
            <h3>{{ banner.title }}</h3>
            <p>{{ banner.desc }}</p>
            <span class="btn btn-accent">{{ banner.ctaText }}</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- ===== DANH MỤC NỔI BẬT (lưới ảnh thật, lấy từ dữ liệu sản phẩm) ===== -->
    <div class="section-title" v-if="featuredSubcategories.length">
      <h2>Danh mục nổi bật</h2>
    </div>
    <div class="cat-photo-grid" v-if="featuredSubcategories.length">
      <router-link
        v-for="fc in featuredSubcategories"
        :key="fc.path.join('>')"
        :to="categoryLink(fc.path)"
        class="cat-photo-card"
      >
        <div class="cpc-thumb">
          <img v-if="fc.image" :src="fc.image" :alt="fc.label">
          <i v-else class="fa-solid fa-couch"></i>
        </div>
        <div class="cpc-label">{{ fc.label }}</div>
      </router-link>
    </div>

    <!-- ===== DẢI BANNER KHUYẾN MÃI ===== -->
    <div class="promo-strip">
      <router-link
        v-for="(promo, i) in content.promoStrip"
        :key="'promo' + i"
        :to="categoryLink(promo.ctaCategory)"
        class="promo-card"
        :style="promo.image ? { backgroundImage: 'url(' + promo.image + ')' } : null"
      >
        <template v-if="!promo.hasOwnText">
          <span class="pc-eyebrow">{{ promo.eyebrow }}</span>
          <span class="pc-title">{{ promo.title }}</span>
          <span class="pc-btn">Mua ngay</span>
        </template>
      </router-link>
    </div>

    <!-- ===== MẪU MỚI ===== -->
    <div class="section-title">
      <h2>Mẫu mới</h2>
      <router-link class="see-all" to="/danh-muc">Xem tất cả</router-link>
    </div>
    <product-grid
      :products="newestProducts"
      :loading="loading"
      loading-text="Đang tải dữ liệu sản phẩm..."
      empty-text="Chưa có dữ liệu sản phẩm. Kiểm tra lại nguồn dữ liệu trong file .env."
      @add-to-cart="handleAddToCart"
      @wish="handleToggleWishlist"
      @quick-view="handleOpenQuickView"
    ></product-grid>

    <!-- ===== 4 TÍNH NĂNG NỔI BẬT ===== -->
    <div class="section-title">
      <h2>Vì sao chọn {{ shopName }}</h2>
    </div>
    <div class="feature-highlights">
      <div class="feature-item" v-for="f in content.featureHighlights" :key="f.number">
        <div class="fi-num">{{ f.number }}</div>
        <div>
          <h4>{{ f.title }}</h4>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- ===== TỪNG KHỐI SẢN PHẨM THEO NGÀNH HÀNG (lặp lại cho mỗi danh mục cấp 1) ===== -->
    <template v-for="cat in topCategories">
      <div class="section-title" :key="'st-' + cat">
        <h2>{{ cat }}</h2>
        <router-link class="see-all" :to="categoryLink([cat])">Xem tất cả</router-link>
      </div>

      <router-link
        v-if="content.categoryBanners[cat]"
        :key="'cb-' + cat"
        :to="categoryLink([cat])"
        class="cat-department-banner"
        :style="{ backgroundImage: 'url(' + content.categoryBanners[cat] + ')' }"
      ></router-link>

      <div class="cat-strip" :key="'cs-' + cat" v-if="subCategoriesOf(cat).length">
        <router-link
          v-for="sub in subCategoriesOf(cat).slice(0, 6)"
          :key="cat + '-' + sub"
          :to="categoryLink([cat, sub])"
        >
          <span class="ci"><i class="fa-solid fa-tag"></i></span>
          <span>{{ sub }}</span>
        </router-link>
      </div>

      <product-grid
        :key="'pg-' + cat"
        :products="productsOf(cat)"
        :loading="false"
        empty-text="Chưa có sản phẩm trong danh mục này."
        @add-to-cart="handleAddToCart"
        @wish="handleToggleWishlist"
        @quick-view="handleOpenQuickView"
      ></product-grid>
    </template>

    <quick-view-modal :product="quickViewProduct" @close="handleCloseQuickView" @add-to-cart="handleAddToCart"></quick-view-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProductGrid from '@/components/product/ProductGrid.vue';
import QuickViewModal from '@/components/product/QuickViewModal.vue';
import productActionsMixin from '@/mixins/productActions';
import config from '@/config';
import siteContent from '@/content/siteContent';
import { getChildCategories, getFeaturedSubcategories, productMatchesCategoryPath } from '@/utils/category';

/**
 * Trang chủ — cấu trúc các khối được dựng để khớp với bố cục thật của
 * site tham khảo: hero 2 khối, danh mục nổi bật có ảnh, dải banner
 * khuyến mãi, mẫu mới, khối 4 tính năng, rồi LẶP LẠI 1 khối
 * "danh mục con + sản phẩm" cho MỖI ngành hàng cấp 1 — hoàn toàn tự
 * động theo dữ liệu thật trong Google Sheet/CSV, không khai báo cứng
 * danh mục nào trong code.
 */
export default {
  name: 'HomeView',
  components: { ProductGrid, QuickViewModal },
  mixins: [productActionsMixin],
  data() {
    return {
      shopName: config.shopName,
      content: siteContent,
    };
  },
  computed: {
    ...mapState('products', { loading: (state) => state.loading }),
    ...mapGetters('products', ['all', 'topCategories']),

    newestProducts() {
      return this.all.slice(0, 12);
    },
    featuredSubcategories() {
      return getFeaturedSubcategories(this.all, 14);
    },
  },
  methods: {
    categoryLink(path) {
      if (!path || !path.length) return '/danh-muc';
      return { name: 'listing', query: { cat: path.join('/') } };
    },
    subCategoriesOf(topCat) {
      return getChildCategories(this.all, [topCat]);
    },
    productsOf(topCat) {
      return this.all.filter((p) => productMatchesCategoryPath(p, [topCat])).slice(0, 8);
    },
  },
};
</script>
