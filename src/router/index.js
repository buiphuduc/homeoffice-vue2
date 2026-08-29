import Vue from 'vue';
import VueRouter from 'vue-router';

import HomeView from '@/views/HomeView.vue';

Vue.use(VueRouter);

/**
 * src/router/index.js
 * ------------------------------------------------------------------
 * Định tuyến bằng URL thật (vd /gio-hang, /san-pham/TT68359) thay vì
 * chuyển "trang" bằng biến JS như bản 1-file HTML trước — lợi ích:
 * - Khách có thể bấm nút "Back" của trình duyệt hoạt động đúng
 * - Có thể copy link gửi bạn bè, mở thẳng vào đúng sản phẩm/danh mục
 * - Dễ thêm SEO sau này nếu cần
 *
 * Các trang khác dùng "lazy loading" (import động) — nghĩa là code của
 * trang đó CHỈ được tải khi người dùng thực sự vào trang đó, giúp trang
 * chủ tải nhanh hơn vì không phải tải hết code của mọi trang cùng lúc.
 * ------------------------------------------------------------------
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/danh-muc',
    name: 'listing',
    component: () => import(/* webpackChunkName: "listing" */ '@/views/ListingView.vue'),
    // Danh mục truyền qua query, ví dụ: /danh-muc?cat=Phòng Khách/Bàn Sofa hoặc /danh-muc?q=từ khóa
    props: (route) => ({
      catPath: route.query.cat ? route.query.cat.split('/') : [],
      searchQuery: route.query.q || '',
    }),
  },
  {
    path: '/san-pham/:id',
    name: 'product-detail',
    component: () => import(/* webpackChunkName: "product-detail" */ '@/views/ProductDetailView.vue'),
    props: true,
  },
  {
    path: '/gio-hang',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '@/views/CartView.vue'),
  },
  {
    path: '/thanh-toan',
    name: 'checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '@/views/CheckoutView.vue'),
  },
  {
    path: '/dat-hang-thanh-cong',
    name: 'order-success',
    component: () => import(/* webpackChunkName: "order-success" */ '@/views/OrderSuccessView.vue'),
  },
  {
    path: '/yeu-thich',
    name: 'wishlist',
    component: () => import(/* webpackChunkName: "wishlist" */ '@/views/WishlistView.vue'),
  },
  {
    // Bắt mọi đường dẫn không khớp -> quay về trang chủ thay vì trang trắng lỗi
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history', // URL sạch, không có dấu #. Lưu ý cấu hình hosting ở bước deploy (xem README).
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }; // luôn cuộn lên đầu trang khi chuyển route
  },
});

export default router;
