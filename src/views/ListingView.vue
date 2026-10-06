<template>
  <div>
    <div class="breadcrumb">
      <router-link to="/">Trang chủ</router-link> /
      <span>{{ pageTitle }}</span>
    </div>

    <div class="listing-top">
      <h2 style="margin:0;font-size:19px;">
        {{ pageTitle }}
        <span style="font-weight:400;font-size:13px;color:var(--ink-soft)">
          ({{ sortedProducts.length }} sản phẩm)
        </span>
      </h2>
      <select class="sort-select" v-model="sortKey">
        <option value="default">Mặc định</option>
        <option value="price-asc">Giá thấp đến cao</option>
        <option value="price-desc">Giá cao đến thấp</option>
        <option value="name-asc">Tên A-Z</option>
      </select>
    </div>

    <div class="listing">
      <aside>
        <div class="filter-box">
          <h4>Danh mục</h4>
          <label v-for="cat in topCategories" :key="cat">
            <input
              type="radio"
              name="fc"
              :checked="catPath[0] === cat"
              @change="goToCategory([cat])"
            >
            {{ cat }}
          </label>
          <label>
            <input type="radio" name="fc" :checked="!catPath.length && !searchQuery" @change="goToCategory([])">
            Tất cả
          </label>
        </div>
      </aside>

      <div>
        <product-grid
          :products="pagedProducts"
          :loading="loading"
          empty-text="Không có sản phẩm phù hợp."
          @add-to-cart="handleAddToCart"
          @wish="handleToggleWishlist"
          @quick-view="handleOpenQuickView"
        ></product-grid>

        <div class="pagination" v-if="totalPages > 1">
          <button v-if="curPage === 1" disabled aria-label="Trang trước"><i class="fa-solid fa-chevron-left"></i></button>
          <router-link v-else class="page-link" :to="pageLink(curPage - 1)" rel="prev" aria-label="Trang trước"><i class="fa-solid fa-chevron-left"></i></router-link>
          <router-link
            v-for="n in visiblePages"
            :key="n"
            class="page-link"
            :class="{ active: curPage === n }"
            :aria-current="curPage === n ? 'page' : null"
            :to="pageLink(n)"
          >{{ n }}</router-link>
          <button v-if="curPage === totalPages" disabled aria-label="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>
          <router-link v-else class="page-link" :to="pageLink(curPage + 1)" rel="next" aria-label="Trang sau"><i class="fa-solid fa-chevron-right"></i></router-link>
        </div>
      </div>
    </div>

    <quick-view-modal :product="quickViewProduct" @close="handleCloseQuickView" @add-to-cart="handleAddToCart"></quick-view-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProductGrid from '@/components/product/ProductGrid.vue';
import QuickViewModal from '@/components/product/QuickViewModal.vue';
import productActionsMixin from '@/mixins/productActions';
import { productMatchesCategoryPath } from '@/utils/category';
import { setPageMeta } from '@/utils/seo';
import config from '@/config';
import { listingPath } from '@/utils/listingRoutes';

/**
 * Trang danh mục / kết quả tìm kiếm. Dùng chung 1 view cho cả 2 trường
 * hợp vì logic gần giống nhau (lọc + sắp xếp + phân trang danh sách sản
 * phẩm) — tránh trùng lặp code giữa "trang danh mục" và "trang tìm kiếm".
 */
export default {
  name: 'ListingView',
  components: { ProductGrid, QuickViewModal },
  mixins: [productActionsMixin],
  props: {
    page: { type: Number, default: 1 },
    catPath: {
      type: Array,
      default: () => [],
    },
    searchQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sortKey: 'default',
      pageSize: config.listing.pageSize,
    };
  },
  computed: {
    curPage() { return this.page; },
    ...mapState('products', { loading: (state) => state.loading }),
    ...mapGetters('products', ['all', 'topCategories']),

    pageTitle() {
      if (this.searchQuery) return `Tìm kiếm: "${this.searchQuery}"`;
      if (this.catPath.length) return this.catPath.join(' / ');
      return 'Tất cả sản phẩm';
    },

    filteredProducts() {
      let list = this.all;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      } else if (this.catPath.length) {
        list = list.filter((p) => productMatchesCategoryPath(p, this.catPath));
      }
      return list;
    },

    sortedProducts() {
      const list = this.filteredProducts.slice();
      if (this.sortKey === 'price-asc') list.sort((a, b) => a.effectivePrice - b.effectivePrice);
      else if (this.sortKey === 'price-desc') list.sort((a, b) => b.effectivePrice - a.effectivePrice);
      else if (this.sortKey === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      return list;
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.sortedProducts.length / this.pageSize));
    },

    pagedProducts() {
      const start = (this.curPage - 1) * this.pageSize;
      return this.sortedProducts.slice(start, start + this.pageSize);
    },

    // THÊM MỚI: Logic phân trang hiển thị 5 số
    visiblePages() {
      let startPage, endPage;
      let maxVisible = 6;

      if (this.totalPages <= maxVisible) {
        startPage = 1;
        endPage = this.totalPages;
      } else {
        if (this.curPage <= 3) {
          startPage = 1;
          endPage = maxVisible;
        } else if (this.curPage + 2 >= this.totalPages) {
          startPage = this.totalPages - 4;
          endPage = this.totalPages;
        } else {
          startPage = this.curPage - 2;
          endPage = this.curPage + 2;
        }
      }

      let pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  watch: {
    sortKey() {
      if (this.curPage !== 1) this.$router.push(this.pageLink(1));
    },
    '$route.fullPath': {
      immediate: true,
      handler() { this.updateSeo(); },
    },
    loading() { this.updateSeo(); },
  },
  methods: {
    pageLink(page) {
      if (this.$route.name === 'search') {
        return { name: 'search', query: { ...this.$route.query, page: page > 1 ? String(page) : undefined } };
      }
      return { path: listingPath(this.catPath, page), query: { ...this.$route.query } };
    },
    updateSeo() {
      setPageMeta({
        title: this.pageTitle,
        description: `Xem ${this.pageTitle.toLowerCase()} tại ${config.shopName} — giao hàng toàn quốc, bảo hành dài hạn.`,
        path: this.$route.fullPath,
        noindex: Boolean(this.searchQuery) || (!this.loading && (!this.sortedProducts.length || this.curPage > this.totalPages)),
      });
    },
    goToCategory(path) {
      this.$router.push(listingPath(path));
    },
  },
};
</script>
