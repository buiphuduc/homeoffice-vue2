<template>
  <nav class="nav-bar" :class="{ 'is-open': mobileOpen }">
    <div class="container">
      <ul class="nav-list">
        <li
          class="nav-item"
          v-for="cat in topCategories"
          :key="cat"
          :class="{ 'is-expanded': expandedCat === cat, 'has-mega': hasGrandchildren(cat) }"
        >
          <router-link :to="listingLink([cat])" @click.native="handleLinkClick">{{ cat }}</router-link>

          <!-- Nút mũi tên: chỉ có tác dụng trên di động (ẩn ở desktop qua CSS) để
               mở/đóng danh mục con bằng cách CHẠM, vì :hover không hoạt động khi chạm -->
          <button
            v-if="childCategories([cat]).length"
            class="nav-item-arrow"
            type="button"
            :aria-label="'Mở danh mục con của ' + cat"
            @click.stop.prevent="toggleExpand(cat)"
          >
            <i class="fa-solid" :class="expandedCat === cat ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>

          <div class="mega" v-if="hasGrandchildren(cat)">
            <div class="mega-col" v-for="c in childCategories([cat])" :key="cat + '-' + c">
              <h4>
                <router-link :to="listingLink([cat, c])" @click.native="handleLinkClick">{{ c }}</router-link>
              </h4>
              <ul>
                <li v-for="g in childCategories([cat, c])" :key="cat + c + g">
                  <router-link :to="listingLink([cat, c, g])" @click.native="handleLinkClick">{{ g }}</router-link>
                </li>
              </ul>
            </div>
          </div>

          <ul class="simple-drop" v-else-if="childCategories([cat]).length">
            <li v-for="c in childCategories([cat])" :key="cat + '-s-' + c">
              <router-link :to="listingLink([cat, c])" @click.native="handleLinkClick">{{ c }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getChildCategories, hasGrandchildren } from '@/utils/category';

/**
 * Mega menu tự dựng 100% từ dữ liệu sản phẩm thật trong store (không có
 * danh mục nào được khai báo cứng trong code) — tức là chỉ hiện danh
 * mục nào ĐANG CÓ sản phẩm thật trong products.csv/Google Sheet. Logic
 * tính cây danh mục nằm ở src/utils/category.js — component này chỉ
 * gọi lại và hiển thị.
 *
 * RESPONSIVE: prop "mobileOpen" do AppHeader.vue điều khiển (bấm nút
 * hamburger) — quyết định cả khối menu có hiện trên di động hay không.
 * Trên desktop, CSS tự chuyển sang kiểu rê chuột (:hover), prop này
 * không có tác dụng (xem @media(min-width:900px) trong main.css).
 *
 * Class "has-mega" gắn thêm vào <li> để CSS biết mục nào cần mở dropdown
 * dạng lưới nhiều cột full-width (neo theo .container) — xem main.css.
 */
export default {
  name: 'MegaMenu',
  props: {
    mobileOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandedCat: null, // danh mục cấp 1 nào đang mở dropdown con trên di động
    };
  },
  computed: {
    ...mapGetters('products', ['topCategories']),
    ...mapState('products', { allProducts: (state) => state.items }),
  },
  watch: {
    // Đóng menu từ ngoài (bấm hamburger đóng lại) -> cũng thu gọn dropdown con đang mở dở
    mobileOpen(isOpen) {
      if (!isOpen) {
        this.expandedCat = null;
      }
    },
  },
  methods: {
    childCategories(parentPath) {
      return getChildCategories(this.allProducts, parentPath);
    },
    hasGrandchildren(cat) {
      return hasGrandchildren(this.allProducts, cat);
    },
    listingLink(catPath) {
      return { name: 'listing', query: { cat: catPath.join('/') } };
    },
    toggleExpand(cat) {
      this.expandedCat = this.expandedCat === cat ? null : cat;
    },
    handleLinkClick() {
      // Bấm vào 1 link danh mục cụ thể -> đóng luôn toàn bộ menu di động lại
      // (báo cho AppHeader.vue biết qua sự kiện 'navigate')
      this.expandedCat = null;
      this.$emit('navigate');
    },
  },
};
</script>
