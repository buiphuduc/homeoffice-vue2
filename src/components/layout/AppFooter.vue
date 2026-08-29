<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col" v-for="(col, i) in columns" :key="i">
        <h5>{{ col.title }}</h5>
        <ul>
          <!-- Cột "Danh mục": link thật, trỏ tới danh mục thật lấy từ dữ liệu sản phẩm (CSV/Sheet) -->
          <template v-if="col.dynamicCategoryLinks">
            <li v-for="cat in topCategories.slice(0, 8)" :key="cat">
              <router-link :to="{ name: 'listing', query: { cat } }">{{ cat }}</router-link>
            </li>
            <li v-if="!topCategories.length" style="opacity:.6;">Chưa có dữ liệu danh mục</li>
          </template>
          <!-- Các cột còn lại: nội dung tĩnh mô tả (chưa có hệ thống trang CMS nên hiển thị dạng chữ, không phải link) -->
          <template v-else>
            <li v-for="(item, j) in col.items" :key="j">{{ item.text }}</li>
          </template>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      &copy; {{ year }} {{ shopName }} — Dữ liệu sản phẩm đồng bộ từ Google Sheet
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex';
import config from '@/config';
import siteContent from '@/content/siteContent';

export default {
  name: 'AppFooter',
  data() {
    return {
      shopName: config.shopName,
      columns: siteContent.footerColumns,
      year: new Date().getFullYear(),
    };
  },
  computed: {
    ...mapGetters('products', ['topCategories']),
  },
};
</script>
