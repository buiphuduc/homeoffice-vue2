import Vue from 'vue';
import VueRouter from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import { setPageMeta } from '@/utils/seo';

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
 *
 * `meta.title`/`meta.description` ở mỗi route là tiêu đề/mô tả SEO MẶC
 * ĐỊNH cho trang đó (xem router.afterEach cuối file). Trang nào cần tiêu
 * đề ĐỘNG theo dữ liệu (tên sản phẩm, tên bài viết...) sẽ tự gọi lại
 * `setPageMeta()` bên trong component của nó (xem ProductDetailView.vue,
 * InspirationArticleView.vue, ListingView.vue) để ghi đè giá trị mặc
 * định này.
 * ------------------------------------------------------------------
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      description: 'HTMVN Shop — nội thất phong cách Scandinavian tối giản: bàn ghế sofa, tủ kệ, phòng khách, phòng ngủ, bếp & phòng ăn, nội thất văn phòng. Giao hàng toàn quốc, bảo hành dài hạn.',
    },
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
    meta: { title: 'Tất cả sản phẩm', description: 'Toàn bộ sản phẩm nội thất của HTMVN Shop — lọc theo danh mục, sắp xếp theo giá.' },
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
    meta: { title: 'Giỏ hàng' },
  },
  {
    path: '/thanh-toan',
    name: 'checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '@/views/CheckoutView.vue'),
    meta: { title: 'Thanh toán' },
  },
  {
    path: '/dat-hang-thanh-cong',
    name: 'order-success',
    component: () => import(/* webpackChunkName: "order-success" */ '@/views/OrderSuccessView.vue'),
    meta: { title: 'Đặt hàng thành công' },
  },
  {
    path: '/yeu-thich',
    name: 'wishlist',
    component: () => import(/* webpackChunkName: "wishlist" */ '@/views/WishlistView.vue'),
    meta: { title: 'Sản phẩm yêu thích' },
  },
  {
    path: '/gioi-thieu',
    name: 'introduce',
    component: () => import(/* webpackChunkName: "introduce" */ '@/views/IntroduceView.vue'),
    meta: { title: 'Giới thiệu', description: 'Câu chuyện thương hiệu HTMVN Shop — nơi kỹ thuật chính xác gặp gỡ thẩm mỹ Scandinavian tối giản.' },
  },
  {
    path: '/lien-he',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '@/views/ContactView.vue'),
    meta: { title: 'Liên hệ', description: 'Thông tin liên hệ, địa chỉ showroom và biểu mẫu gửi tin nhắn tới HTMVN Shop.' },
  },
  {
    path: '/cam-hung-sang-tao',
    name: 'inspiration',
    component: () => import(/* webpackChunkName: "inspiration" */ '@/views/InspirationView.vue'),
    meta: { title: 'Cảm hứng thiết kế', description: 'Ý tưởng, xu hướng và hướng dẫn thiết kế nội thất phong cách Scandinavian từ HTMVN Shop.' },
  },
  {
    path: '/cam-hung-sang-tao/:slug',
    name: 'inspiration-article',
    component: () => import(/* webpackChunkName: "inspiration-article" */ '@/views/InspirationArticleView.vue'),
    props: true,
  },
  {
    path: '/chinh-sach/:slug',
    name: 'legal-page',
    component: () => import(/* webpackChunkName: "legal-page" */ '@/views/LegalPageView.vue'),
    props: true,
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

// Cập nhật SEO mặc định mỗi khi đổi route, dựa trên `meta.title`/
// `meta.description` khai báo ở route tương ứng (xem phía trên). Trang
// nào có nội dung động (sản phẩm, bài viết, danh mục...) sẽ tự gọi lại
// `setPageMeta()` ngay trong component để ghi đè giá trị này ngay sau.
router.afterEach((to) => {
  setPageMeta({
    title: to.meta && to.meta.title,
    description: to.meta && to.meta.description,
    path: to.fullPath,
  });
});

export default router;
