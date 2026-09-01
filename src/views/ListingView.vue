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
          <button :disabled="curPage === 1" @click="curPage--"><i class="fa-solid fa-chevron-left"></i></button>
          
          <!-- Đã sửa: lặp qua mảng visiblePages thay vì totalPages -->
          <button
            v-for="n in visiblePages"
            :key="n"
            :class="{ active: curPage === n }"
            @click="curPage = n"
          >{{ n }}</button>
          
          <button :disabled="curPage === totalPages" @click="curPage++"><i class="fa-solid fa-chevron-right"></i></button>
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
import config from '@/config';

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
      curPage: 1,
      pageSize: config.listing.pageSize,
    };
  },
  computed: {
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
    // Đổi danh mục/từ khóa tìm kiếm (qua router) -> luôn quay về trang 1
    catPath() {
      this.curPage = 1;
    },
    searchQuery() {
      this.curPage = 1;
    },
    sortKey() {
      this.curPage = 1;
    },
  },
  methods: {
    goToCategory(path) {
      if (!path.length) {
        this.$router.push({ name: 'listing' });
      } else {
        this.$router.push({ name: 'listing', query: { cat: path.join('/') } });
      }
    },
  },
};
</script>