<template>
  <div class="introduce-view">
    <main>
      <!-- Hero Section -->
      <section ref="hero" class="hero-section" aria-labelledby="intro-hero-title"
        :style="heroStyle">
        <div class="hero-card group">
          <img
            v-show="!heroBroken"
            alt="Xưởng sản xuất nội thất HTMVN — không gian chế tác gỗ theo phong cách Bắc Âu tối giản"
            class="hero-img"
            fetchpriority="high"
            src="/images/gioi-thieu/hero-gioi-thieu.webp"
            @error="heroBroken = true"
          />
          <div class="img-fallback" v-if="heroBroken">
            <span class="material-symbols-outlined">photo_camera</span>
          </div>
          <div class="hero-overlay" aria-hidden="true"></div>
          <div class="hero-content">
            <p class="hero-eyebrow">{{ shopName }} · Câu chuyện thương hiệu</p>
            <h1 id="intro-hero-title" class="hero-title">Tinh tế trong thiết kế.<br>Ấm áp trong từng không gian.</h1>
            <p class="hero-description">Từ sự tỉ mỉ trong từng chi tiết đến tính tiện dụng mỗi ngày, HTM mang tinh thần tối giản và ấm áp vào không gian sống của bạn.</p>
            <router-link class="hero-cta" to="/danh-muc">Khám phá nội thất <span aria-hidden="true">→</span></router-link>
          </div>
        </div>
      </section>

      <!-- Quote Section -->
      <section class="container quote-section">
        <div class="quote-content">
          <h2 class="display-text text-primary">
            "Thiết kế đẹp bắt đầu từ sự chính xác — nơi kỹ thuật gặp gỡ cảm xúc, và từng thớ gỗ được kể lại bằng một ngôn ngữ tối giản, ấm áp."
          </h2>
          <p class="body-text text-variant mt-lg">
            {{ shopName }} là thương hiệu nội thất trực thuộc {{ company.legalName }} — nơi tư duy kỹ thuật chính xác của một đơn vị gia công, lắp đặt lâu năm hội tụ cùng gu thẩm mỹ Bắc Âu tối giản. Chúng tôi tin rằng nội thất không chỉ để lấp đầy không gian, mà để tạo ra một chốn về mang đậm tinh thần Hygge: tĩnh lặng, đúng công năng và bền theo thời gian trong mọi tác phẩm, từ phòng khách, phòng ngủ đến không gian làm việc.
          </p>
        </div>
      </section>

      <!-- Timeline Section -->
      <section class="container timeline-section">
        <div class="timeline-header">
          <h2 class="headline-text text-surface">Hành trình của chúng tôi</h2>
        </div>

        <div class="timeline-grid">
          <!-- Milestone 1 -->
          <div class="timeline-item group">
            <div class="timeline-year text-primary">Giai đoạn 01</div>
            <h3 class="timeline-title text-surface group-hover-primary">Nền tảng kỹ thuật</h3>
            <p class="timeline-desc text-variant">
              Khởi nguồn từ đội ngũ kỹ thuật chuyên gia công, lắp đặt công trình — nền tảng tạo nên sự chính xác trong từng mối ghép nội thất sau này.
            </p>
          </div>
          <!-- Milestone 2 -->
          <div class="timeline-item group">
            <div class="timeline-year text-primary">Giai đoạn 02</div>
            <h3 class="timeline-title text-surface group-hover-primary">Định hình phong cách</h3>
            <p class="timeline-desc text-variant">
              Phát triển dòng sản phẩm nội thất mang tinh thần Scandinavian: đường nét tối giản, vật liệu tự nhiên, ưu tiên sự tiện dụng lâu dài.
            </p>
          </div>
          <!-- Milestone 3 -->
          <div class="timeline-item group">
            <div class="timeline-year text-primary">Giai đoạn 03</div>
            <h3 class="timeline-title text-surface group-hover-primary">Mở rộng danh mục</h3>
            <p class="timeline-desc text-variant">
              Phủ khắp các không gian sống: phòng khách, bếp & phòng ăn, phòng ngủ, phòng tắm, nội thất văn phòng, ngoài trời và cả các giải pháp kỹ thuật công trình.
            </p>
          </div>
          <!-- Milestone 4 -->
          <div class="timeline-item group">
            <div class="timeline-year text-primary">Hiện tại</div>
            <h3 class="timeline-title text-surface group-hover-primary">Đồng hành cùng khách hàng</h3>
            <p class="timeline-desc text-variant">
              {{ shopName }} phục vụ khách hàng trên toàn quốc qua nền tảng trực tuyến, với showroom tại {{ company.address }}.
            </p>
          </div>
        </div>
      </section>

      <!-- Team / Craftsmanship Section -->
      <section class="container bento-section">
        <div class="bento-header">
          <h2 class="headline-text text-surface bento-title">Bàn tay tài hoa đằng sau mỗi thiết kế</h2>
          <router-link class="bento-link text-primary group" to="/danh-muc">
            Khám phá sản phẩm
            <span class="material-symbols-outlined bento-icon">arrow_forward</span>
          </router-link>
        </div>

        <div class="bento-grid">
          <!-- Large Feature Image -->
          <div class="bento-card col-span-2 group">
            <img
              v-show="!bentoBroken.large"
              alt="Đội ngũ kỹ thuật và thiết kế HTMVN trong xưởng chế tác nội thất"
              class="bento-img"
              src="/images/gioi-thieu/xuong-thiet-ke.jpg"
              @error="bentoBroken.large = true"
            />
            <div class="img-fallback" v-if="bentoBroken.large">
              <span class="material-symbols-outlined">photo_camera</span>
            </div>
            <div class="bento-overlay">
              <p class="bento-tag text-on-primary">Xưởng thiết kế & kỹ thuật</p>
              <p class="bento-desc text-on-primary-dim">Nơi bản vẽ kỹ thuật và ý tưởng thẩm mỹ gặp nhau — mỗi sản phẩm đều được tính toán về kết cấu trước khi thành hình.</p>
            </div>
          </div>

          <!-- Secondary Image 1 -->
          <div class="bento-card group">
            <img
              v-show="!bentoBroken.artisan"
              alt="Người thợ đang hoàn thiện chi tiết đồ gỗ nội thất"
              class="bento-img"
              src="/images/gioi-thieu/nghe-nhan-hoan-thien.jpg"
              @error="bentoBroken.artisan = true"
            />
            <div class="img-fallback" v-if="bentoBroken.artisan">
              <span class="material-symbols-outlined">photo_camera</span>
            </div>
            <div class="bento-overlay-small">
              <p class="bento-tag text-on-primary">Người thợ hoàn thiện</p>
            </div>
          </div>

          <!-- Secondary Image 2 -->
          <div class="bento-card group">
            <img
              v-show="!bentoBroken.detail"
              alt="Cận cảnh mối ghép mộng gỗ tự nhiên"
              class="bento-img"
              src="/images/gioi-thieu/chi-tiet-moi-ghep.jpg"
              @error="bentoBroken.detail = true"
            />
            <div class="img-fallback" v-if="bentoBroken.detail">
              <span class="material-symbols-outlined">photo_camera</span>
            </div>
            <div class="bento-overlay-small">
              <p class="bento-tag text-on-primary">Chi tiết mối ghép</p>
            </div>
          </div>

          <!-- Text Card -->
          <div class="bento-text-card col-span-2">
            <h3 class="bento-text-title text-on-secondary">Sự tỉ mỉ trong từng thớ gỗ</h3>
            <p class="bento-text-desc text-on-secondary-variant">
              Mỗi đường cong, mỗi mối ghép không chỉ là kỹ thuật, mà là sự tôn trọng đối với vật liệu. Chúng tôi tuyển chọn kỹ càng từ gỗ sồi tự nhiên nguyên khối, gỗ tự nhiên phủ veneer sơn PU, đến gỗ công nghiệp MDF/MFC phủ Melamine hay Laminate chống ẩm — kết hợp cùng khung thép sơn tĩnh điện, mặt kính cường lực hay đá Quartz nhân tạo cho từng dòng sản phẩm phù hợp. Nhờ vậy, theo thời gian sản phẩm không chỉ bền bỉ mà còn mang dấu ấn riêng của gia chủ.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import config from '@/config';
import siteContent from '@/content/siteContent';

/**
 * src/views/IntroduceView.vue
 * ------------------------------------------------------------------
 * Trang Giới thiệu — GIỮ NGUYÊN bố cục & hiệu ứng CSS gốc (hero zoom
 * hover, bento grid zoom hover, mũi tên trượt khi hover link...), chỉ
 * thay nội dung chữ cho đúng với thương hiệu thật ({{ shopName }} /
 * {{ company.legalName }}) và thay ảnh demo (link Google AIDA) bằng
 * đường dẫn ảnh cục bộ — xem prompt tạo ảnh AI tương ứng ở phần trả lời
 * kèm theo, đặt file đúng tên vào public/images/gioi-thieu/.
 *
 * Nếu ảnh thật chưa có/lỗi 404, tự động hiện icon placeholder thay vì
 * icon "ảnh vỡ" xấu xí (cùng cách xử lý với ProductGallery.vue).
 * ------------------------------------------------------------------
 */
export default {
  name: 'IntroduceView',
  data() {
    return {
      shopName: config.shopName,
      company: siteContent.companyInfo,
      heroBroken: false,
      heroOffset: 130,
      viewportWidth: null,
      bentoBroken: { large: false, artisan: false, detail: false },
    };
  },
  computed: {
    heroStyle() {
      return {
        '--intro-offset': this.heroOffset + 'px',
        '--intro-width': this.viewportWidth ? this.viewportWidth + 'px' : '100%',
      };
    },
  },
  mounted() {
  this.heroMeasureFrame = null;
  this.heroDisposed = false;
  this.scheduleHeroMeasure();

  window.addEventListener('resize', this.scheduleHeroMeasure, {
    passive: true,
  });

  if (typeof ResizeObserver !== 'undefined') {
    this.layoutObserver = new ResizeObserver(
      this.scheduleHeroMeasure
    );

    const header = document.querySelector('.site-header');
    if (header) this.layoutObserver.observe(header);
  }
},

beforeDestroy() {
  this.heroDisposed = true;

  window.removeEventListener('resize', this.scheduleHeroMeasure);

  if (this.layoutObserver) {
    this.layoutObserver.disconnect();
  }

  if (this.heroMeasureFrame !== null) {
    cancelAnimationFrame(this.heroMeasureFrame);
    this.heroMeasureFrame = null;
  }
},

methods: {
  scheduleHeroMeasure() {
    if (this.heroDisposed || this.heroMeasureFrame !== null) return;

    this.heroMeasureFrame = requestAnimationFrame(() => {
      this.heroMeasureFrame = null;
      if (!this.heroDisposed) this.measureHero();
    });
  },

  measureHero() {
    const hero = this.$refs.hero;
    if (!hero) return;

    const width = document.documentElement.clientWidth;
    const offset = Math.max(
      0,
      Math.round(hero.getBoundingClientRect().top + window.pageYOffset)
    );

    if (this.viewportWidth !== width) {
      this.viewportWidth = width;
    }

    if (this.heroOffset !== offset) {
      this.heroOffset = offset;
    }
  },
},
};
</script>

<style scoped>
/* Import Fonts and Icons */
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600&family=Inter:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

/* CSS Variables for Theme */
.introduce-view {
  --bg-color: #fdf9f2;
  --on-bg-color: #1c1c17;
  --primary-color: #715b3e;
  --on-surface-variant: #4d453c;
  --surface-container-low: #f7f3ec;
  --outline-variant: #d1c4b9;
  --secondary-fixed: #ebe1d7;
  --on-secondary-fixed: #1f1b15;
  --on-secondary-fixed-variant: #4c463f;
  --on-primary: #ffffff;
  
  --font-heading: 'Hanken Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  background-color: var(--bg-color);
  color: var(--on-bg-color);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 24px;
  -webkit-font-smoothing: antialiased;
}

/* Base Utilities */
.text-primary { color: var(--primary-color); }
.text-surface { color: var(--on-bg-color); }
.text-variant { color: var(--on-surface-variant); }
.text-on-primary { color: var(--on-primary); }
.text-on-primary-dim { color: rgba(255, 255, 255, 0.9); }
.text-on-secondary { color: var(--on-secondary-fixed); }
.text-on-secondary-variant { color: var(--on-secondary-fixed-variant); }

.mt-lg { margin-top: 48px; }

/* Layout & Containers */
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}
@media (min-width: 768px) {
  .container {
    padding: 0 80px;
  }
}

/* Typography */
.display-text {
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}
@media (min-width: 768px) {
  .display-text {
    font-size: 64px;
    line-height: 72px;
    font-weight: 300;
    letter-spacing: -0.02em;
  }
}

.headline-text {
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
}
@media (min-width: 768px) {
  .headline-text {
    font-size: 40px;
    line-height: 48px;
    letter-spacing: -0.01em;
  }
}

.body-text {
  font-size: 18px;
  line-height: 28px;
}

/* Full-width hero; height fills the viewport below the shared header. */
.hero-section {
  width: var(--intro-width, 100%);
  margin-left: calc(50% - var(--intro-width, 100%) / 2);
}
.hero-card {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - var(--intro-offset, 130px));
  min-height: calc(100svh - var(--intro-offset, 130px));
  overflow: hidden;
  background: #29251f;
  color: #fff;
}
.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 10s ease-out;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(90deg, rgba(20,17,13,.76), rgba(20,17,13,.4) 60%, rgba(20,17,13,.18));
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(48px, 8vh, 112px) clamp(24px, 7vw, 112px);
  box-sizing: border-box;
}
.hero-eyebrow {
  margin: 0 0 24px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.hero-title {
  max-width: 900px;
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(36px, 4.8vw, 76px);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -.025em;
  color: #fff;
  text-wrap: balance;
}
.hero-description {
  max-width: 550px;
  margin: 24px 0 32px;
  font-size: clamp(15px, 1.25vw, 18px);
  line-height: 1.75;
  color: rgba(255,255,255,.92);
}
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  min-height: 48px;
  padding: 12px 22px;
  border: 1px solid rgba(255,255,255,.8);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background .2s, color .2s;
}
.hero-cta:hover { background: #fff; color: #29251f; }
.hero-cta:focus-visible { outline: 2px solid #fff; outline-offset: 5px; }
.group:hover .hero-img {
  transform: scale(1.05);
}
@media (max-width: 600px) {
  .hero-overlay { background: linear-gradient(0deg, rgba(20,17,13,.8), rgba(20,17,13,.38)); }
  .hero-eyebrow { font-size: 10px; letter-spacing: .12em; }
  .hero-description { max-width: 34ch; }
}

/* Placeholder hiện khi ảnh chưa có / load lỗi (404) — tránh icon "ảnh vỡ" */
.img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-fixed), var(--surface-container-low));
}
.img-fallback .material-symbols-outlined {
  font-size: 48px;
  color: var(--outline-variant);
}

/* Quote Section */
.quote-section {
  padding-top: 80px;
  padding-bottom: 80px;
}
.quote-content {
  max-width: 896px; /* max-w-4xl */
  margin: 0 auto;
  text-align: center;
}
.quote-content .body-text {
  max-width: 672px; /* max-w-2xl */
  margin-left: auto;
  margin-right: auto;
}

/* Timeline Section */
.timeline-section {
  padding-top: 80px;
  padding-bottom: 80px;
  background-color: var(--surface-container-low);
  border-radius: 8px;
}
.timeline-header {
  margin-bottom: 48px;
}
@media (min-width: 768px) {
  .timeline-header {
    margin-bottom: 80px;
  }
}
.timeline-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}
@media (min-width: 768px) {
  .timeline-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}
.timeline-item {
  border-top: 1px solid var(--outline-variant);
  padding-top: 24px;
}
.timeline-year {
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.timeline-title {
  font-family: var(--font-heading);
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin-bottom: 12px;
  transition: color 0.3s;
}
.group:hover .group-hover-primary {
  color: var(--primary-color);
}
.timeline-desc {
  font-size: 16px;
  line-height: 24px;
}

/* Bento Section */
.bento-section {
  padding-top: 80px;
  padding-bottom: 80px;
}
@media (min-width: 768px) {
  .bento-section {
    padding-top: 120px;
    padding-bottom: 120px;
  }
}
.bento-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 80px;
  gap: 24px;
}
@media (min-width: 768px) {
  .bento-header {
    flex-direction: row;
    align-items: flex-end;
  }
}
.bento-title {
  max-width: 448px; /* max-w-md */
}
.bento-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.3s;
}
.bento-link:hover {
  color: var(--on-bg-color);
}
.bento-icon {
  font-size: 14px;
  transition: transform 0.3s;
}
.bento-link:hover .bento-icon {
  transform: translateX(4px);
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  /* minmax(...,auto): hàng cao tối thiểu 300px nhưng TỰ GIÃN theo nội dung
     (trước đây cố định 300px nên khung chữ dài bị tràn ra ngoài trên mobile) */
  grid-auto-rows: minmax(300px, auto);
}
@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 400px;
  }
}
.bento-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.5s;
}
.bento-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.bento-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 8s ease-out;
}
.group:hover .bento-img {
  transform: scale(1.05);
}
.bento-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}
@media (min-width: 768px) {
  .bento-overlay {
    padding: 48px;
  }
}
.bento-overlay-small {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}
.bento-tag {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.bento-desc {
  font-size: 16px;
  max-width: 448px;
}
.bento-text-card {
  background-color: var(--secondary-fixed);
  border-radius: 8px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 768px) {
  .bento-text-card {
    padding: 48px;
  }
}
.bento-text-title {
  font-family: var(--font-heading);
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin-bottom: 24px;
}
.bento-text-desc {
  font-size: 16px;
  line-height: 24px;
  max-width: 672px; /* max-w-2xl */
}
@media (min-width: 768px) {
  .col-span-2 {
    grid-column: span 2 / span 2;
  }
}
</style>