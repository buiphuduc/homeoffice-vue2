<template>
  <div class="inspiration-view">
    <main class="container">
      
      <!-- Header Section -->
      <header class="page-header fade-in-up">
        <h1 class="page-title text-on-surface">Cảm hứng thiết kế</h1>
        <p class="page-subtitle text-variant">Khám phá những ý tưởng, xu hướng mới nhất và câu chuyện đằng sau phong cách sống Scandinavian tĩnh lặng và ấm áp.</p>
      </header>

      <!-- Category Filter Chips -->
      <div class="filter-chips fade-in-up delay-1">
        <button 
          v-for="(cat, index) in categories" 
          :key="index"
          :class="['chip-btn', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Featured Article (Bento style) -->
      <section class="featured-bento fade-in-up delay-2">
        <!-- Main Featured -->
        <div class="bento-main bento-card group">
          <img 
            class="bento-img" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWkqs4Bj0Wmt_J6w7mXxdB1e4X9o-3SBiPRFAH_RS-aB8TvFoWrJiv1jo7-yaSMS5SZsKRqNUdTLFYAGbcofpf0c_-83DJK7nhvo9c7qPrp9JQdRf7eg-mJFDCLYSDKc3LilrT-kr0vzLpC7pHiO6c-NgoEO1iZsdMre6ZSH0Ric9Jwyhpem2GfJ0f3fZFNU80B365ZF8JEHWAFkXLyh1wq8nrayoiI29arC6QJ-vjZUAzCJRESn966Q" 
            alt="Spacious living room"
          />
          <div class="bento-overlay-dark"></div>
          <div class="bento-content">
            <span class="badge badge-surface">BÀI VIẾT NỔI BẬT</span>
            <h2 class="bento-title text-white">Nghệ thuật ánh sáng trong không gian Bắc Âu</h2>
            <p class="bento-desc text-white-dim">Làm thế nào để tối đa hóa ánh sáng tự nhiên và sử dụng đèn trang trí để tạo ra bầu không khí ấm cúng (hygge) trong những ngày đông giá lạnh.</p>
            <div class="bento-meta text-white-dim">
              <span>Bởi Sarah Jensen</span>
              <span class="dot">•</span>
              <span>Đọc 5 phút</span>
            </div>
          </div>
        </div>

        <!-- Side Featured -->
        <div class="bento-side">
          <div class="bento-card side-card group">
            <img 
              class="bento-img" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBujTqR_9NSLKph_glMBEwHf_l4OTs_SvG3oR49lxdTEYoVKcpLhBOEnzjGdAPG4z7n_u8vxk2XrxAgig6Vs_ZUNZeb7eKADJK2KmKmnEiElp15f2zQkXAjO8DBNYjpOVDDdJLOO6ERhfA8AAfXlhZynwd_hm347fodqxAGBhMtDt-d9iWs-ZeSQxGFmk4CcgtJx3RMiQ8549wsRX3LqhXG4C3zCFKuuGmL-UplXB9__7gt1oXtlqNLCQ" 
              alt="Oak chair"
            />
            <div class="bento-overlay-light"></div>
            <div class="side-content bg-gradient-bottom">
              <span class="tag text-primary-light">VẬT LIỆU</span>
              <h3 class="side-title text-white">Vẻ đẹp vượt thời gian của gỗ sồi</h3>
            </div>
          </div>
          
          <div class="bento-card quote-card hover-glow">
            <span class="material-symbols-outlined quote-icon">format_quote</span>
            <p class="quote-text">"Thiết kế tốt không chỉ là vẻ bề ngoài, mà là cảm giác nó mang lại khi bạn chạm vào và sống cùng nó mỗi ngày."</p>
            <span class="quote-author">— Triết lý Nordique</span>
          </div>
        </div>
      </section>

      <!-- Masonry Grid for Inspiration & Articles -->
      <div class="masonry-grid fade-in-up delay-3">
        <!-- Item 1: Inspiration -->
        <article class="masonry-item card-hover">
          <div class="img-container aspect-3-4 group">
            <img class="img-fluid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDcJRuHFL1Dvxhs39CTwuaOtYbtaju4G3TrXtzlo6xUluxBTGH9cTCO1KGXAMXPFr6fWYbDJY5jYHX8iN15wby8e_z8kTr6JovENomWJjkGIhRdxJYKP_V1J-dXPlxA_qClKDd4UBY41ab_-lhDmNUvxFn9ueY_uuN4ON5oD3__OPD8J2l8RiwVYHUN60GO1FGte10Krq2cBEQ91Ksq13VX8jTvLIi8Lr7XP8Im0siNst5RandbGeQ5g" alt="Bedroom ideas" />
            <div class="bookmark-btn">
              <span class="material-symbols-outlined icon-small">bookmark</span>
            </div>
          </div>
          <div class="card-body">
            <span class="tag text-variant">Ý TƯỞNG PHÒNG NGỦ</span>
            <h3 class="card-title">Sự tĩnh lặng của màu trung tính</h3>
          </div>
        </article>

        <!-- Item 2: Article -->
        <article class="masonry-item card-hover">
          <div class="img-container h-200 group">
            <img class="img-fluid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMIxuv9npf6Pp1PZjELxhM5jRaf_uOWtztoMawNFsy1HSgVuXC4SHm2J52mi3Yf2BQYuIIkV8B3vpaFMFYKEtNfZAo2iKTrgGFt71zivaWhQsVqYx26AZotm2AEwSLGm8-HFIvFeSQoafh-EpB2Ecj1Lf3oT_WbICRU-peZ7qr2f8mzeUpaxhBIBgvt9WFMd3uOpqztsjKybdoHr2NnH5FpZpk-gROietv8MBx3unF3mAzX7Uc45FGeA" alt="Fabric swatches" />
          </div>
          <div class="card-body">
            <span class="tag text-primary">HƯỚNG DẪN</span>
            <h3 class="card-title-lg">Cách phối hợp các kết cấu vải trong không gian nhỏ</h3>
            <p class="card-desc">Việc sử dụng các loại vải khác nhau như linen, len và boucle có thể tạo thêm chiều sâu cho căn phòng mà không làm rối mắt.</p>
            <a href="#" class="read-more">
              Đọc tiếp <span class="material-symbols-outlined ml-icon">arrow_forward</span>
            </a>
          </div>
        </article>

        <!-- Item 3: Inspiration -->
        <article class="masonry-item card-hover">
          <div class="img-container aspect-4-3 group">
            <img class="img-fluid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRsz7BLqT2p49Z6Ahzk7x1SGgjjFxs4YPxg0ykUp6LuTZoX7Qg-Zq_ctX3RTZPH39igcSqFVHbX7Xk8Qwo5-FVHVGc0Y60L2GM8l3gezAntltfDWUkgEydDdAPBwdC_p7SjQ1SEvdmeqbkiKPsOvOR_bT1cCzqvZDwMzb7Hb70ZrZdHf-MGie62xpfJLtzYDZf7KfIXMhvxpmTu2-DC8Bv0tt7a12HyDHFkNkzzUP3kS1C8-TbkJtj_g" alt="Minimalist kitchen" />
          </div>
          <div class="card-body">
            <span class="tag text-variant">NHÀ BẾP</span>
            <h3 class="card-title">Tối giản công năng</h3>
          </div>
        </article>

        <!-- Item 4: Product Focus -->
        <article class="masonry-item card-hover product-focus">
          <div class="product-img-wrapper group">
            <div class="pulse-bg"></div>
            <img class="product-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1SNXczkEuscr95xPm6-q98_02446BYm6Fe5YUiAiNWJa2_alXsL7wDTemE7s22p-dMpB_MB-h6T3rzxA26-sbDDIGzY7YdDXDDxwPJ6iqZMokfix1bigQB1KwuqETDcZz1JBfvUjYLecOP8Xcv7RHcqhfz95wXFYVF8xe7sf07ggAsW67i91HX5jctYkiK6qAkrBz2V6nYZQ-9wqE8Ql_NSZFpTc-ao3EOp05BPWwToDcOo0jYp846A" alt="Pendant light" />
          </div>
          <h3 class="card-title-lg">Đèn thả trần Lumi</h3>
          <p class="card-desc text-center">Điểm nhấn hoàn hảo cho bàn ăn.</p>
          <button class="btn-outline">XEM SẢN PHẨM</button>
        </article>

        <!-- Item 5: Inspiration Tall -->
        <article class="masonry-item card-hover">
          <div class="img-container aspect-9-16 group">
            <img class="img-fluid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb2jaNr73BqYUQDQ9kFLsGb9uFI1a-Fd7PWO7N2ELxGZsZXSP6PQ8g9rLmWm1eHlm69H5aiJUJumG8AwVyQrdG9MgNBB_lCwZ3ZdDdAluzena8pyO9QbtglSNACYMypu2X5JmuxtJCH3BoM2MnrpCMiVXdylt0kuXtUWJDHpa6mDZwkFzyKcQ3tjJq6adwKWpNiA9jtHzU4yjF5Oq00aXCGOC43ZN2KjSCLvVE4Pi-TzKYNnBeOxiHjQ" alt="Reading nook" />
            <div class="title-overlay">
              <span class="overlay-text">Góc đọc sách hoàn hảo</span>
            </div>
          </div>
        </article>

        <!-- Item 6: Discussion Article -->
        <article class="masonry-item card-hover">
          <div class="card-body large-padding">
            <span class="tag text-tertiary">XU HƯỚNG</span>
            <h3 class="card-title-lg mb-sm">Trở về với tự nhiên: Xu hướng Biophilic Design</h3>
            <p class="card-desc mb-lg">Mang thiên nhiên vào nhà không chỉ dừng lại ở việc đặt vài chậu cây, mà là sự kết nối sâu sắc thông qua vật liệu và ánh sáng.</p>
            
            <div class="authors-avatar">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpE5h-4iuNz7s0RXLreIN3883w91iaQezsoGYD3c7JDOPgz21YoZwg-h4yWBaAkCOZAkEr5t5_ZnQN-cs18zgZUs6fBBOZMrZ_Y-zixn7N5-kmACZ15jgFHenyUS0cRyEVHMjFIbxz72emgk9GToFscft8RtK85LPIisFnAtFuXLlAXcftxz1UFbb4CIMxt_CuQ54QTi1iJfVb_St57l5D-wv8bWg4t0EH7_hmEnC6OqQfj9AzTcs-RQ" alt="Author 1" />
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUYov86YszWUU8VmuJuM5NC-JuBTNp7J5eajUR4j1MHynWFx_wb3z6EI2jfe8YqX29bVTdEIhJRU8hjnN_YCRBm5PUmAQrdaooWyJIcYfr8QCTzrVgNKaqlBLXXN9fOmPEx_QtbECIRSvoNfar0vdA8wCeV7vXlDtSZfSqFuIask2bdHpCPxTiOcY9gtalKhZCSjRiedIUQEpNXWmmwKwTwRSrXluUOCSAUy9P793JtfZDB1l3lVtkBA" alt="Author 2" />
            </div>
            
            <a href="#" class="read-more">
              Đọc thảo luận <span class="material-symbols-outlined ml-icon">arrow_forward</span>
            </a>
          </div>
        </article>
      </div>

      <!-- Load More Button -->
      <div class="load-more-container fade-in-up delay-4">
        <button class="btn-load-more">
          TẢI THÊM
          <span class="hover-sweep"></span>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InspirationView',
  data() {
    return {
      activeCategory: 'TẤT CẢ',
      categories: [
        'TẤT CẢ',
        'Ý TƯỞNG PHÒNG KHÁCH',
        'KHÔNG GIAN NHỎ',
        'XU HƯỚNG MÀU SẮC',
        'HƯỚNG DẪN CHỌN VẬT LIỆU'
      ]
    };
  }
};
</script>

<style scoped>
/* =========================================
   THIẾT LẬP BIẾN MÀU (Dựa trên Tailwind Config)
   ========================================= */
.inspiration-view {
  --primary: #715b3e;
  --primary-light: #dfc29f;
  --primary-container: #8b7355;
  --on-primary-container: #0a0400;
  
  --surface: #fdf9f2;
  --on-surface: #1c1c17;
  --surface-variant: #e6e2db;
  --on-surface-variant: #4d453c;
  
  --surface-container: #f2ede6;
  --surface-container-low: #f7f3ec;
  --surface-container-high: #ece8e1;
  
  --outline-variant: #d1c4b9;
  --tertiary: #515f71;

  --font-heading: 'Hanken Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  background-color: var(--surface);
  color: var(--on-surface);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  padding-bottom: 80px;
}

/* =========================================
   TYPOGRAPHY & UTILS
   ========================================= */
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 20px;
}
@media (min-width: 768px) { .container { padding: 80px 48px; } }

.text-on-surface { color: var(--on-surface); }
.text-variant { color: var(--on-surface-variant); }
.text-primary { color: var(--primary); }
.text-primary-light { color: var(--primary-light); }
.text-white { color: #ffffff; }
.text-white-dim { color: rgba(255, 255, 255, 0.85); }
.text-tertiary { color: var(--tertiary); }
.text-center { text-align: center; }

/* =========================================
   ANIMATIONS (Sáng tạo thêm)
   ========================================= */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0;
}
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

/* =========================================
   HEADER SECTION
   ========================================= */
.page-header {
  margin-bottom: 48px;
  text-align: center;
}
@media (min-width: 768px) { .page-header { text-align: left; margin-bottom: 80px; } }

.page-title {
  font-family: var(--font-heading);
  font-size: 40px;
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 24px;
}
@media (min-width: 768px) { .page-title { font-size: 64px; } }

.page-subtitle {
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}
@media (min-width: 768px) { .page-subtitle { margin: 0; } }

/* =========================================
   FILTER CHIPS
   ========================================= */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 48px;
}
.chip-btn {
  padding: 8px 24px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  border: 1px solid var(--outline-variant);
  background: transparent;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.3s ease;
}
.chip-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}
.chip-btn.active {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border-color: var(--primary-container);
  box-shadow: 0 4px 10px rgba(139, 115, 85, 0.2);
}

/* =========================================
   BENTO GRID (Featured)
   ========================================= */
.featured-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 80px;
}
@media (min-width: 768px) {
  .featured-bento { grid-template-columns: 8fr 4fr; }
}

.bento-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--surface-variant);
  background-color: var(--surface-container-high);
  cursor: pointer;
}
.bento-main {
  height: 400px;
}
@media (min-width: 768px) { .bento-main { height: 500px; } }

.bento-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.side-card { flex: 1; min-height: 240px; }
.quote-card {
  flex: 1;
  background-color: var(--surface-container-low);
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.4s ease;
}

/* Images & Effects in Bento */
.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.group:hover .bento-img { transform: scale(1.05); }

.bento-overlay-dark {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28, 28, 23, 0.9) 0%, transparent 60%);
}
.bento-overlay-light {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.15);
  transition: background 0.4s;
}
.group:hover .bento-overlay-light { background: rgba(0,0,0,0.05); }

.bento-content {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 32px;
  width: 100%;
  z-index: 2;
}
.bg-gradient-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 24px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}
.badge-surface {
  background: rgba(253, 249, 242, 0.9);
  color: var(--primary);
  backdrop-filter: blur(4px);
}

.bento-title { font-family: var(--font-heading); font-size: 28px; margin-bottom: 12px; line-height: 1.3;}
@media (min-width: 768px) { .bento-title { font-size: 40px; } }
.side-title { font-family: var(--font-heading); font-size: 24px; margin-top: 8px; }

.bento-desc { font-size: 16px; margin-bottom: 24px; max-width: 600px; line-height: 1.5; }
.bento-meta { font-size: 12px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
.tag { font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; display: block;}

/* Quote card specific */
.quote-icon { font-size: 40px; color: var(--primary); margin-bottom: 16px; }
.quote-text { font-size: 18px; font-style: italic; line-height: 1.6; margin-bottom: 16px; }
.quote-author { font-size: 12px; color: var(--on-surface-variant); font-weight: 600; }
.hover-glow:hover {
  border-color: var(--primary-light);
  box-shadow: 0 10px 30px rgba(113, 91, 62, 0.08);
  transform: translateY(-4px);
}

/* =========================================
   MASONRY GRID
   ========================================= */
.masonry-grid {
  column-count: 1;
  column-gap: 24px;
}
@media (min-width: 768px) { .masonry-grid { column-count: 2; } }
@media (min-width: 1024px) { .masonry-grid { column-count: 3; } }

.masonry-item {
  break-inside: avoid;
  margin-bottom: 24px;
  background-color: var(--surface);
  border: 1px solid var(--surface-variant);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.card-hover:hover {
  box-shadow: 0 15px 35px -5px rgba(113, 91, 62, 0.12);
  transform: translateY(-6px);
}

.img-container { position: relative; overflow: hidden; }
.h-200 { height: 200px; }
.aspect-3-4 { aspect-ratio: 3 / 4; }
.aspect-4-3 { aspect-ratio: 4 / 3; }
.aspect-9-16 { aspect-ratio: 9 / 16; }

.img-fluid {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}
.group:hover .img-fluid { transform: scale(1.06); }

.bookmark-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(253, 249, 242, 0.9);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}
.group:hover .bookmark-btn {
  opacity: 1;
  transform: translateY(0);
}
.bookmark-btn:hover { color: var(--primary); }
.icon-small { font-size: 20px; }

.card-body { padding: 24px; }
.large-padding { padding: 32px; }
.card-title { font-family: var(--font-body); font-size: 18px; margin-top: 8px; line-height: 1.4; }
.card-title-lg { font-family: var(--font-heading); font-size: 24px; margin-top: 8px; margin-bottom: 12px; }
.card-desc { font-size: 16px; line-height: 1.5; color: var(--on-surface-variant); margin-bottom: 16px;}
.mb-sm { margin-bottom: 8px; }
.mb-lg { margin-bottom: 24px; }

.read-more {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.3s;
}
.read-more:hover { opacity: 0.7; }
.ml-icon { margin-left: 4px; font-size: 16px; transition: transform 0.3s;}
.read-more:hover .ml-icon { transform: translateX(4px); }

.title-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: flex-end;
  padding: 24px;
}
.group:hover .title-overlay { opacity: 1; }
.overlay-text { color: var(--surface); font-size: 16px; transform: translateY(10px); transition: transform 0.4s; }
.group:hover .overlay-text { transform: translateY(0); }

/* Product Focus Special Styling */
.product-focus {
  background-color: var(--surface-container);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.product-img-wrapper {
  width: 128px;
  height: 128px;
  position: relative;
  margin-bottom: 24px;
}
.pulse-bg {
  position: absolute;
  inset: 0;
  background-color: rgba(113, 91, 62, 0.1);
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(113, 91, 62, 0.2); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(113, 91, 62, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(113, 91, 62, 0); }
}
.product-img {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}
.group:hover .product-img { transform: translateY(-5px); }

.btn-outline {
  padding: 8px 24px;
  border: 1px solid var(--on-surface);
  border-radius: 4px;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-outline:hover { background: var(--on-surface); color: var(--surface); }

/* Authors Avatar */
.authors-avatar {
  display: flex;
  margin-bottom: 24px;
}
.authors-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--surface);
  margin-left: -8px;
  object-fit: cover;
}
.authors-avatar img:first-child { margin-left: 0; }

/* =========================================
   LOAD MORE BUTTON
   ========================================= */
.load-more-container {
  text-align: center;
  margin-top: 64px;
}
.btn-load-more {
  position: relative;
  padding: 12px 48px;
  border: 1px solid var(--outline-variant);
  border-radius: 6px;
  background: transparent;
  color: var(--on-surface);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  overflow: hidden;
  transition: color 0.4s ease;
}
.hover-sweep {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: var(--surface-variant);
  z-index: -1;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.btn-load-more:hover .hover-sweep {
  transform: translateX(0);
}
</style>