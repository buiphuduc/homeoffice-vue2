<template>
  <div>
    <!-- ===== HERO: 1 banner lớn + 2 banner nhỏ xếp chồng ===== -->
    <section class="hf" ref="hero" :class="{ 'is-booted': booted, 'is-scrolled': scrolled }"
      :style="{ '--hf-offset': offset + 'px' }"
      @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <!-- Thanh chọn concept (viên thuốc trượt mượt giữa các tab) -->
      <div class="hf-nav" role="tablist" aria-label="Chọn không gian" :style="{ '--i': navIndex }"
        @keydown.left.prevent="go(-1)" @keydown.right.prevent="go(1)">
        <span class="hf-nav-pill"></span>
        <button v-for="(c, i) in concepts" :key="c.id" role="tab" :aria-selected="requested === c.id"
          class="hf-nav-btn" :class="{ on: requested === c.id }" :tabindex="requested === c.id ? 0 : -1"
          @click="select(c.id)"><span class="hf-nav-n">{{ i + 1 }}.</span> {{ c.label }}</button>
      </div>

      <!-- CONCEPT 1: THIẾT KẾ (phác thảo -> ảnh thật) -->
      <div class="hc hc-sketch" :class="{ active: isOn('sketch'), was: prev === 'sketch', play: sketchRun }"
        :aria-hidden="String(active !== 'sketch')" :inert="active !== 'sketch'">
        <div class="hf-bg hf-bg-sketch" :style="bg(imgs.sketch)"></div>
        <div class="hf-bg hf-bg-real" :style="bg(imgs.sketch)"></div>
        <span class="hf-scan"></span>
        <div class="hf-text">
          <component :is="titleTag('sketch')" class="hf-title">Phòng khách<br>ấm cúng, sum vầy</component>
          <p>Từ bản vẽ đến không gian thực</p>
          <router-link :to="heroLink(links.sketch)" class="hf-cta">Xem nội thất phòng khách <i class="fa-solid fa-arrow-right"></i></router-link>
        </div>
      </div>

      <!-- CONCEPT 2: CẢM XÚC (ánh sáng theo giờ) -->
      <div class="hc hc-time" :class="{ active: isOn('time'), was: prev === 'time' }"
        :aria-hidden="String(active !== 'time')" :inert="active !== 'time'">
        <div class="hf-bg" :style="bg(imgs.time)"></div>
        <hero-time-controls @label-change="timeLabel = $event"></hero-time-controls>
        <div class="hf-text">
          <component :is="titleTag('time')" class="hf-title">Phòng ngủ<br>bình yên từng giờ</component>
          <p><transition name="hf-swap" mode="out-in"><span class="hf-sw" :key="timeLabel">{{ timeLabel }}</span></transition></p>
          <router-link :to="heroLink(links.time)" class="hf-cta">Xem nội thất phòng ngủ <i class="fa-solid fa-arrow-right"></i></router-link>
        </div>

      </div>

      <!-- CONCEPT 3: ĐA VŨ TRỤ (chuyển phong cách) -->
      <div class="hc hc-multi" :class="{ active: isOn('multiverse'), was: prev === 'multiverse' }"
        :aria-hidden="String(active !== 'multiverse')" :inert="active !== 'multiverse'">
        <div v-for="t in themes" :key="t.id" class="hf-bg hf-bg-theme" :class="['th-' + t.id, { on: theme === t.id, was: prevTheme === t.id }]"
          :style="bg(imgs[t.id])"></div>
        <div class="hf-text">
          <component :is="titleTag('multiverse')" class="hf-title"><transition name="hf-swap" mode="out-in"><span class="hf-sw" :key="theme">{{ currentTheme.title }}</span></transition></component>
          <p><transition name="hf-swap" mode="out-in"><span class="hf-sw" :key="theme">{{ currentTheme.sub }}</span></transition></p>
          <router-link :to="heroLink(links[theme])" class="hf-cta"><transition name="hf-swap" mode="out-in"><span class="hf-sw" :key="theme">{{ currentTheme.cta }}</span></transition> <i class="fa-solid fa-arrow-right"></i></router-link>
        </div>
        <div class="hf-panel hf-switch" role="radiogroup" aria-label="Chọn không gian">
          <button v-for="t in themes" :key="t.id" role="radio" :aria-checked="themeReq === t.id"
            :class="{ on: themeReq === t.id }" @click="pickTheme(t.id)">
            <span class="hf-knob"></span><span class="hf-sw-label"><small class="hf-kicker">Không gian</small><b>{{ t.name }}</b></span>
          </button>
        </div>
      </div>

      <!-- Gợi ý cuộn xuống -->
      <button type="button" class="hf-scroll" aria-label="Cuộn xuống xem sản phẩm" @click="scrollDown">
        <span class="hf-scroll-text">Cuộn xuống</span>
        <span class="hf-scroll-line"><i></i></span>
      </button>
    </section>

    <!-- ===== DANH MỤC NỔI BẬT (lưới ảnh thật, lấy từ dữ liệu sản phẩm) ===== -->
    <div class="section-title" v-if="featuredSubcategories.length" v-reveal>
      <h2>Danh mục nổi bật</h2>
    </div>
    <div class="cat-photo-grid" v-if="featuredSubcategories.length" v-reveal="80">
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
    <!-- <div class="promo-strip">
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
    </div> -->

    <!-- ===== MẪU MỚI ===== -->
    <div class="section-title" v-reveal>
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
    <div class="section-title" v-reveal>
      <h2>Vì sao chọn {{ shopName }}</h2>
    </div>
    <div class="feature-highlights" v-reveal="80">
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
      <div class="section-title" :key="'st-' + cat" v-reveal>
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

// Keep frame-by-frame updates inside this small component, away from product lists.
const HeroTimeControls = {
  name: 'HeroTimeControls',
  data() {
    return { time: 0 };
  },
  created() {
    this.pendingTime = 0;
    this.frame = null;
    this.lastLabel = 'Bình minh trong trẻo';
  },
  beforeDestroy() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
  },
  methods: {
    onInput(event) {
      const value = Number(event.target.value);
      if (!Number.isFinite(value)) return;
      this.pendingTime = Math.max(0, Math.min(100, value));
      // Coalesce rapid input events; the latest position wins on the next frame.
      if (this.frame !== null) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        this.time = this.pendingTime;
        const label = this.time < 33 ? 'Bình minh trong trẻo'
          : this.time < 66 ? 'Hoàng hôn ấm áp' : 'Đêm tịnh thư thái';
        if (label !== this.lastLabel) {
          this.lastLabel = label;
          this.$emit('label-change', label);
        }
      });
    },
  },
  render(h) {
    const t = this.time / 100;
    const ss = (a, b, x) => {
      const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };
    const lights = [
      { background: '#fff', opacity: 0.1 + 0.33 * ss(0, 0.33, t) * (1 - ss(0.33, 0.62, t)), mixBlendMode: 'overlay' },
      { background: 'rgb(255,140,0)', opacity: 0.5 * ss(0.22, 0.5, t) * (1 - ss(0.62, 0.86, t)), mixBlendMode: 'color' },
      { background: 'rgb(10,20,50)', opacity: 0.9 * ss(0.5, 0.92, t), mixBlendMode: 'multiply' },
    ];
    // No stacking context here: lights stay below hero text, controls stay above it.
    return h('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none' } }, [
      ...lights.map((style, i) => h('div', { key: i, class: 'hf-light', style })),
      h('div', {
        class: 'hf-panel hf-time',
        // Avoid re-blurring the changing full-screen lighting behind the slider.
        style: { pointerEvents: 'auto', backdropFilter: 'none', WebkitBackdropFilter: 'none' },
      }, [
        h('p', 'Điều chỉnh thời gian trong ngày'),
        h('input', {
          attrs: { type: 'range', min: '0', max: '100', step: '0.1', 'aria-label': 'Thời gian trong ngày' },
          domProps: { value: this.time },
          style: { touchAction: 'none' },
          on: { input: this.onInput, change: this.onInput },
        }),
        h('div', { class: 'hf-time-marks' }, ['Sáng', 'Chiều', 'Tối'].map(label => h('span', label))),
      ]),
    ]);
  },
};

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
  components: { ProductGrid, QuickViewModal, HeroTimeControls },
  mixins: [productActionsMixin],
  data() {
    return {
      shopName: config.shopName,
      content: siteContent,
      // ----- Hero full màn hình -----
      offset: 0,
      scrolled: false, // đã cuộn khỏi đầu trang -> ẩn gợi ý cuộn xuống
      touch: null, // toạ độ chạm bắt đầu (vuốt đổi tab)
      sketchRun: false, // bật/tắt animation mở ảnh của concept 1 (chạy lại mỗi lần vào tab)
      booted: false, // chỉ bật sau khi ảnh đầu tiên tải xong -> hiệu ứng mở đầu luôn chạy đủ
      active: 'sketch', // tab đang hiển thị
      requested: 'sketch', // tab người dùng vừa bấm (nút tab sáng ngay); nội dung chuyển theo sau, lần lượt
      prev: null, // tab cũ, giữ nguyên bên dưới cho đến khi tab mới hiện đủ
      busy: false,
      timeLabel: 'Bình minh trong trẻo',
      theme: 'modern',
      themeReq: 'modern',
      prevTheme: null,
      themeBusy: false,
      concepts: [
        { id: 'sketch', label: 'Phòng khách' },
        { id: 'time', label: 'Phòng ngủ' },
        { id: 'multiverse', label: 'Không gian' },
      ],
      // Tab 3: mỗi mục ứng với 1 ảnh trong siteContent.heroShowcase.images (theo khoá id)
      themes: [
        { id: 'modern', name: 'Phòng bếp', title: 'Phòng bếp\ngỗ sồi ấm áp', sub: 'Tủ bếp kem, mặt đá đen, ánh đèn vàng dịu', cta: 'Xem nội thất phòng bếp' },
        { id: 'classic', name: 'Phòng ăn', title: 'Phòng ăn\ntràn ngập ánh nắng', sub: 'Bàn tròn gỗ, ghế bọc bouclé, đảo bếp đá cẩm thạch', cta: 'Xem nội thất phòng ăn' },
        { id: 'wabi', name: 'Phòng làm việc', title: 'Góc làm việc\ntại nhà đầy cảm hứng', sub: 'Bàn gỗ sồi, kệ sách trắng, ánh sáng tự nhiên', cta: 'Xem nội thất làm việc' },
      ],
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
    imgs() {
      return this.content.heroShowcase.images;
    },
    links() {
      return this.content.heroShowcase.links || {};
    },
    currentTheme() {
      return this.themes.find((t) => t.id === this.theme);
    },
    navIndex() {
      return this.concepts.findIndex((c) => c.id === this.requested);
    },
  },
  mounted() {
    this.measureOffset();
    window.addEventListener('resize', this.measureOffset);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
    // Tải trước toàn bộ ảnh; chờ ảnh đầu tiên xong (tối đa 3s) rồi mới bắt đầu hiệu ứng mở đầu
    const urls = Object.values(this.imgs);
    urls.forEach((u) => this.loadImage(u));
    this.loadImage(this.imgs.sketch, 3000).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => { this.booted = true; this.sketchRun = this.active === 'sketch'; }));
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.measureOffset);
    window.removeEventListener('scroll', this.onScroll);
    clearTimeout(this.busyTimer);
    clearTimeout(this.themeTimer);
  },
  methods: {
    // Chỉ tab đang hiển thị dùng thẻ <h1> (SEO + trình đọc màn hình); tab ẩn dùng <div>
    titleTag(id) {
      return this.active === id ? 'h1' : 'div';
    },
    // Chuyển tab theo bước (+1 / -1), vòng lại ở hai đầu
    go(step) {
      const n = this.concepts.length;
      const next = (this.navIndex + step + n) % n;
      this.select(this.concepts[next].id);
      this.$nextTick(() => {
        const btn = this.$refs.hero && this.$refs.hero.querySelectorAll('.hf-nav-btn')[next];
        if (btn && document.activeElement && document.activeElement.classList.contains('hf-nav-btn')) btn.focus();
      });
    },
    // Vuốt ngang trên điện thoại để đổi tab (bỏ qua khi đang kéo thanh trượt / bấm nút)
    onTouchStart(e) {
      if (e.target.closest('.hf-panel, .hf-nav, .hf-scroll') || e.touches.length !== 1) { this.touch = null; return; }
      this.touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    },
    onTouchEnd(e) {
      const st = this.touch;
      this.touch = null;
      if (!st || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - st.x;
      const dy = e.changedTouches[0].clientY - st.y;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - st.t > 700) return;
      this.go(dx < 0 ? 1 : -1); // vuốt sang trái -> tab kế tiếp
    },
    onScroll() {
      this.scrolled = window.pageYOffset > 60;
    },
    scrollDown() {
      const el = this.$refs.hero;
      if (!el) return;
      const hdr = document.querySelector('header.site-header');
      const top = el.getBoundingClientRect().bottom + window.pageYOffset - (hdr ? hdr.offsetHeight : 0);
      window.scrollTo({ top, behavior: 'smooth' });
    },
    /* ---- Chuyển tab: mỗi lúc chỉ chạy MỘT lần chuyển cảnh ----
       Bấm nhanh nhiều lần thì chỉ nhớ lần bấm cuối; nó sẽ chạy ngay khi cảnh hiện tại xong.
       Nhờ vậy không bao giờ có nhiều lớp ảnh nửa trong suốt chồng nhau (nguyên nhân gây nháy sáng). */
    select(id) {
      this.requested = id;
      if (!this.busy) this.commit();
    },
    commit() {
      if (this.active === this.requested) return;
      const from = this.active;
      this.active = this.requested;
      if (!this.booted) return;
      this.prev = from; // lớp cũ giữ nguyên độ sáng bên dưới, lớp mới mờ dần hiện lên trên
      this.busy = true;
      if (this.active === 'sketch') { // vào tab Phòng khách: chạy lại phác thảo -> ảnh thật
        this.sketchRun = false;
        this.$nextTick(() => requestAnimationFrame(() => { this.sketchRun = true; }));
      }
      clearTimeout(this.busyTimer);
      this.busyTimer = setTimeout(() => { // tab mới đã hiện đủ -> gỡ tab cũ (lúc này đã bị che hoàn toàn)
        if (this.prev === 'sketch') this.sketchRun = false;
        this.prev = null;
        this.busy = false;
        this.commit(); // có lần bấm khác đang chờ thì chạy tiếp
      }, 1900);
    },
    // Tab 3: đổi ảnh theo cùng nguyên tắc (ảnh cũ ở yên bên dưới, ảnh mới hiện dần lên trên)
    pickTheme(id) {
      this.themeReq = id;
      if (!this.themeBusy) this.commitTheme();
    },
    commitTheme() {
      if (this.theme === this.themeReq) return;
      this.prevTheme = this.theme;
      this.theme = this.themeReq;
      this.themeBusy = true;
      clearTimeout(this.themeTimer);
      this.themeTimer = setTimeout(() => {
        this.prevTheme = null;
        this.themeBusy = false;
        this.commitTheme();
      }, 1700);
    },
    isOn(id) {
      return this.booted && this.active === id;
    },
    loadImage(url, timeout) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = url;
        if (timeout) setTimeout(resolve, timeout);
      });
    },
    bg(url) {
      return { backgroundImage: 'url(' + url + ')' };
    },
    // Hero cao bằng phần màn hình còn lại dưới header
    measureOffset() {
      const el = this.$refs.hero;
      if (el) this.offset = Math.round(el.getBoundingClientRect().top + window.pageYOffset);
    },
    // Link cho nút ở hero: 1 danh mục -> như categoryLink; nhiều danh mục -> gộp bằng | + tiêu đề (label)
    heroLink(link) {
      const paths = (link && link.paths) || [];
      if (!paths.length) return '/danh-muc';
      if (paths.length === 1) return this.categoryLink(paths[0]);
      return {
        name: 'listing',
        query: { cat: paths.map((p) => p.join('/')).join('|'), label: link.label || '' },
      };
    },
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