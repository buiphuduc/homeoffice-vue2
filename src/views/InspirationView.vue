<template>
  <div class="inspiration-view">
    <main class="container">
      
      <!-- Header Section -->
      <header class="page-header fade-in-up">
        <h1 class="page-title text-on-surface">Cảm hứng thiết kế</h1>
        <p class="page-subtitle text-variant">Khám phá những ý tưởng, xu hướng mới nhất từ {{ shopName }} và câu chuyện đằng sau phong cách sống Scandinavian tĩnh lặng, ấm áp.</p>
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
        <router-link :to="{ name: 'inspiration-article', params: { slug: 'anh-sang-bac-au' } }" class="bento-main bento-card group">
          <img
            v-show="!imgBroken.heroMain"
            class="bento-img"
            src="/images/cam-hung/anh-sang-bac-au.jpg"
            alt="Phòng khách ngập ánh sáng tự nhiên theo phong cách Bắc Âu"
            @error="imgErr('heroMain')"
          />
          <div class="img-fallback" v-if="imgBroken.heroMain">
            <span class="material-symbols-outlined">image</span>
          </div>
          <div class="bento-overlay-dark"></div>
          <div class="bento-content">
            <span class="badge badge-surface">BÀI VIẾT NỔI BẬT</span>
            <h2 class="bento-title text-white">Nghệ thuật ánh sáng trong không gian Bắc Âu</h2>
            <p class="bento-desc text-white-dim">Làm thế nào để tối đa hóa ánh sáng tự nhiên và sử dụng đèn trang trí để tạo ra bầu không khí ấm cúng (hygge) trong những ngày đông giá lạnh.</p>
            <div class="bento-meta text-white-dim">
              <span>Đội ngũ nội dung {{ shopName }}</span>
              <span class="dot">•</span>
              <span>Đọc 5 phút</span>
            </div>
          </div>
        </router-link>

        <!-- Side Featured -->
        <div class="bento-side">
          <router-link :to="{ name: 'inspiration-article', params: { slug: 've-dep-go-soi' } }" class="bento-card side-card group">
            <img
              v-show="!imgBroken.heroSide"
              class="bento-img"
              src="/images/cam-hung/ban-go-soi.jpg"
              alt="Bàn sofa gỗ sồi tự nhiên nguyên khối"
              @error="imgErr('heroSide')"
            />
            <div class="img-fallback" v-if="imgBroken.heroSide">
              <span class="material-symbols-outlined">image</span>
            </div>
            <div class="bento-overlay-light"></div>
            <div class="side-content bg-gradient-bottom">
              <span class="tag text-primary-light">VẬT LIỆU</span>
              <h3 class="side-title text-white">Vẻ đẹp vượt thời gian của gỗ sồi</h3>
            </div>
          </router-link>
          
          <div class="bento-card quote-card hover-glow">
            <span class="material-symbols-outlined quote-icon">format_quote</span>
            <p class="quote-text">"Thiết kế tốt không chỉ là vẻ bề ngoài, mà là cảm giác nó mang lại khi bạn chạm vào và sống cùng nó mỗi ngày."</p>
            <span class="quote-author">— Triết lý thiết kế {{ shopName }}</span>
          </div>
        </div>
      </section>

      <!-- Masonry Grid for Inspiration & Articles -->
      <div class="masonry-grid fade-in-up delay-3" v-if="hasResults">
        <!-- Item 1: Inspiration — Phòng ngủ -->
        <router-link
          tag="article"
          :to="{ name: 'inspiration-article', params: { slug: 'mau-trung-tinh-phong-ngu' } }"
          class="masonry-item card-hover"
          v-show="activeCategory === 'TẤT CẢ' || activeCategory === 'PHÒNG NGỦ'"
        >
          <div class="img-container aspect-3-4 group">
            <img
              v-show="!imgBroken.bedroom"
              class="img-fluid"
              src="/images/cam-hung/phong-ngu-trung-tinh.jpg"
              alt="Phòng ngủ tối giản tông màu trung tính ấm áp"
              @error="imgErr('bedroom')"
            />
            <div class="img-fallback" v-if="imgBroken.bedroom">
              <span class="material-symbols-outlined">image</span>
            </div>
            <div class="bookmark-btn" :class="{ 'is-saved': isSaved('bedroom') }" @click.stop.prevent="toggleSave('bedroom')">
              <span class="material-symbols-outlined icon-small">bookmark</span>
            </div>
          </div>
          <div class="card-body">
            <span class="tag text-variant">Ý tưởng phòng ngủ</span>
            <h3 class="card-title">Sự tĩnh lặng của màu trung tính</h3>
          </div>
        </router-link>

        <!-- Item 2: Article — Hướng dẫn vật liệu -->
        <article
          class="masonry-item card-hover"
          v-show="activeCategory === 'TẤT CẢ' || activeCategory === 'VẬT LIỆU & XU HƯỚNG'"
        >
          <div class="img-container h-200 group">
            <img
              v-show="!imgBroken.fabric"
              class="img-fluid"
              src="/images/cam-hung/mau-vai-boc.jpg"
              alt="Các mẫu vải bọc nội thất: linen, len, boucle"
              @error="imgErr('fabric')"
            />
            <div class="img-fallback" v-if="imgBroken.fabric">
              <span class="material-symbols-outlined">image</span>
            </div>
          </div>
          <div class="card-body">
            <span class="tag text-primary">Hướng dẫn</span>
            <h3 class="card-title-lg">Cách phối hợp các kết cấu vải trong không gian nhỏ</h3>
            <p class="card-desc">Việc sử dụng các loại vải khác nhau như linen, len và boucle có thể tạo thêm chiều sâu cho căn phòng mà không làm rối mắt.</p>
            <router-link :to="{ name: 'inspiration-article', params: { slug: 'phoi-vai-khong-gian-nho' } }" class="read-more">
              Đọc tiếp <span class="material-symbols-outlined ml-icon">arrow_forward</span>
            </router-link>
          </div>
        </article>

        <!-- Item 3: Inspiration — Bếp & phòng ăn -->
        <router-link
          tag="article"
          :to="{ name: 'inspiration-article', params: { slug: 'bep-toi-gian-cong-nang' } }"
          class="masonry-item card-hover"
          v-show="activeCategory === 'TẤT CẢ' || activeCategory === 'BẾP & PHÒNG ĂN'"
        >
          <div class="img-container aspect-4-3 group">
            <img
              v-show="!imgBroken.kitchen"
              class="img-fluid"
              src="/images/cam-hung/bep-toi-gian.jpg"
              alt="Gian bếp tối giản phong cách Scandinavian"
              @error="imgErr('kitchen')"
            />
            <div class="img-fallback" v-if="imgBroken.kitchen">
              <span class="material-symbols-outlined">image</span>
            </div>
          </div>
          <div class="card-body">
            <span class="tag text-variant">Bếp & phòng ăn</span>
            <h3 class="card-title">Tối giản công năng cho gian bếp nhỏ</h3>
          </div>
        </router-link>

        <!-- Item 4: Product Focus — Bàn bên sofa -->
        <router-link
          tag="article"
          :to="{ name: 'inspiration-article', params: { slug: 'ban-ben-sofa-dang-tron' } }"
          class="masonry-item card-hover product-focus"
          v-show="activeCategory === 'TẤT CẢ' || activeCategory === 'PHÒNG KHÁCH'"
        >
          <div class="product-img-wrapper group">
            <div class="pulse-bg"></div>
            <img
              v-show="!imgBroken.sideTable"
              class="product-img"
              src="/images/cam-hung/ban-ben-sofa.jpg"
              alt="Bàn bên sofa dáng tròn mặt gỗ"
              @error="imgErr('sideTable')"
            />
            <div class="img-fallback" v-if="imgBroken.sideTable">
              <span class="material-symbols-outlined">image</span>
            </div>
          </div>
          <h3 class="card-title-lg">Bàn bên sofa dáng tròn</h3>
          <p class="card-desc text-center">Điểm nhấn tinh tế ngay cạnh ghế sofa nhà bạn.</p>
          <span class="btn-outline">XEM CHI TIẾT</span>
        </router-link>

        <!-- Item 5: Inspiration Tall — Góc đọc sách -->
        <router-link
          tag="article"
          :to="{ name: 'inspiration-article', params: { slug: 'goc-doc-sach-hoan-hao' } }"
          class="masonry-item card-hover"
          v-show="activeCategory === 'TẤT CẢ' || activeCategory === 'PHÒNG KHÁCH'"
        >
          <div class="img-container aspect-9-16 group">
            <img
              v-show="!imgBroken.readingNook"
              class="img-fluid"
              src="/images/cam-hung/goc-doc-sach.jpg"
              alt="Góc đọc sách ấm cúng cạnh cửa sổ"
              @error="imgErr('readingNook')"
            />
            <div class="img-fallback" v-if="imgBroken.readingNook">
              <span class="material-symbols-outlined">image</span>
            </div>
            <div class="title-overlay">
              <span class="overlay-text">Góc đọc sách hoàn hảo</span>
            </div>
          </div>
        </router-link>

        <!-- Item 6: Discussion Article — Xu hướng Biophilic -->
        <article
          class="masonry-item card-hover"
          v-show="activeCategory === 'TẤT CẢ' || activeCategory === 'VẬT LIỆU & XU HƯỚNG'"
        >
          <div class="card-body large-padding">
            <span class="tag text-tertiary">Xu hướng</span>
            <h3 class="card-title-lg mb-sm">Trở về với tự nhiên: Xu hướng Biophilic Design</h3>
            <p class="card-desc mb-lg">Mang thiên nhiên vào nhà không chỉ dừng lại ở việc đặt vài chậu cây, mà là sự kết nối sâu sắc thông qua vật liệu và ánh sáng — điều mà {{ shopName }} luôn đặt lên hàng đầu khi lựa chọn vật liệu cho từng dòng sản phẩm.</p>
            
            <div class="authors-avatar">
              <div class="avatar-fallback" v-if="imgBroken.avatar1">
                <span class="material-symbols-outlined">person</span>
              </div>
              <img v-show="!imgBroken.avatar1" src="/images/cam-hung/avatar-doi-ngu-1.jpg" alt="Đại diện đội ngũ nội dung" @error="imgErr('avatar1')" />
              <div class="avatar-fallback" v-if="imgBroken.avatar2">
                <span class="material-symbols-outlined">person</span>
              </div>
              <img v-show="!imgBroken.avatar2" src="/images/cam-hung/avatar-doi-ngu-2.jpg" alt="Đại diện đội ngũ thiết kế" @error="imgErr('avatar2')" />
            </div>
            
            <router-link :to="{ name: 'inspiration-article', params: { slug: 'xu-huong-biophilic-design' } }" class="read-more">
              Đọc tiếp <span class="material-symbols-outlined ml-icon">arrow_forward</span>
            </router-link>
          </div>
        </article>
      </div>

      <!-- Empty state khi bộ lọc không khớp bài viết nào -->
      <div class="empty-state fade-in-up delay-3" v-else>
        <span class="material-symbols-outlined empty-icon">search_off</span>
        <p class="card-desc">Chưa có bài viết nào trong danh mục này. Hãy thử chọn danh mục khác.</p>
      </div>

      <!-- Load More Button -->
      <div class="load-more-container fade-in-up delay-4" v-if="hasResults">
        <button class="btn-load-more" @click="handleLoadMore">
          TẢI THÊM
          <span class="hover-sweep"></span>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import config from '@/config';

/**
 * src/views/InspirationView.vue
 * ------------------------------------------------------------------
 * Trang "Cảm hứng sáng tạo" — GIỮ NGUYÊN bố cục & hiệu ứng CSS gốc
 * (bento grid, masonry, fade-in-up, hover zoom, hover-sweep nút...).
 * Những thay đổi chính so với bản gốc:
 *
 * 1. Bộ lọc chip giờ THỰC SỰ lọc được bài viết bên dưới (bản gốc chỉ
 *    đổi trạng thái active, không lọc gì cả) — dùng v-show so khớp
 *    activeCategory với danh mục gắn cho từng bài viết/card.
 * 2. Mỗi bài viết/card khi bấm vào sẽ chuyển hướng tới TRANG CHI TIẾT
 *    bài viết đó (route /cam-hung-sang-tao/:slug, xem
 *    InspirationArticleView.vue) — nội dung đầy đủ + ảnh minh hoạ nằm
 *    ở src/content/inspirationArticles.js. Trang chi tiết mới có CTA
 *    dẫn sang danh mục/sản phẩm thật, không còn href="#" chết ở đâu cả.
 * 3. Bỏ tên người/thương hiệu hư cấu ("Sarah Jensen", "Nordique"),
 *    thay bằng {{ shopName }} lấy từ config thật của site.
 * 4. Nút bookmark (chỉ có ở card "Phòng ngủ" như thiết kế gốc) giờ
 *    bấm được thật — lưu tạm trong phiên làm việc (không có backend).
 * 5. Ảnh demo (link Google AIDA) đổi thành đường dẫn cục bộ kèm
 *    fallback icon nếu ảnh chưa có/lỗi — xem prompt tạo ảnh AI tương
 *    ứng ở phần trả lời kèm theo.
 * ------------------------------------------------------------------
 */
export default {
  name: 'InspirationView',
  data() {
    return {
      shopName: config.shopName,
      activeCategory: 'TẤT CẢ',
      categories: [
        'TẤT CẢ',
        'PHÒNG KHÁCH',
        'PHÒNG NGỦ',
        'BẾP & PHÒNG ĂN',
        'VẬT LIỆU & XU HƯỚNG',
      ],
      // Số bài viết thật có ở mỗi danh mục — dùng để biết khi nào hiện
      // empty-state (bộ lọc không khớp bài viết nào).
      categoryCounts: {
        'PHÒNG NGỦ': 1,
        'VẬT LIỆU & XU HƯỚNG': 2,
        'BẾP & PHÒNG ĂN': 1,
        'PHÒNG KHÁCH': 2,
      },
      savedIds: {},
      imgBroken: {},
    };
  },
  computed: {
    hasResults() {
      return this.activeCategory === 'TẤT CẢ' || !!this.categoryCounts[this.activeCategory];
    },
  },
  methods: {
    isSaved(id) {
      return !!this.savedIds[id];
    },
    toggleSave(id) {
      const next = !this.savedIds[id];
      this.$set(this.savedIds, id, next);
      this.$store.dispatch('toast/push', {
        title: next ? 'Đã lưu vào mục yêu thích của bạn' : 'Đã bỏ lưu bài viết',
      });
    },
    imgErr(key) {
      this.$set(this.imgBroken, key, true);
    },
    handleLoadMore() {
      this.$store.dispatch('toast/push', {
        title: 'Bạn đã xem hết bài viết hiện có',
        desc: 'Ghé lại sau — nội dung cảm hứng mới sẽ được cập nhật thường xuyên.',
      });
    },
  },
};
</script>

<style scoped>
/* Trang này dùng font Hanken Grotesk/Inter + icon Material Symbols giống
   trang Giới thiệu — import riêng tại đây để trang vẫn hiển thị đúng
   font/icon dù người dùng vào thẳng /cam-hung-sang-tao mà chưa từng
   ghé /gioi-thieu trước đó (2 file .vue không tự chia sẻ CSS cho nhau). */
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600&family=Inter:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

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

/* =========================================
   BỔ SUNG MỚI: fallback ảnh lỗi/chưa có, trạng thái đã lưu, empty-state
   (thêm thuần, không đổi hiệu ứng/luật CSS đã có ở trên)
   ========================================= */

/* Ảnh demo chưa thay bằng ảnh thật / lỗi 404 -> hiện icon placeholder
   đẹp thay vì icon "ảnh vỡ" của trình duyệt. */
.img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--surface-container-high), var(--surface-container-low));
}
.img-fallback .material-symbols-outlined {
  font-size: 40px;
  color: var(--outline-variant);
}

/* Nút bookmark bấm được thật: khi đã lưu, icon tô đặc + đổi màu primary */
.bookmark-btn.is-saved {
  opacity: 1;
  transform: translateY(0);
}
.bookmark-btn.is-saved .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
  color: var(--primary);
}

/* Avatar fallback khi ảnh đại diện đội ngũ chưa có/lỗi */
.avatar-fallback {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--surface);
  margin-left: -8px;
  background: var(--surface-container-high);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-fallback:first-child { margin-left: 0; }
.avatar-fallback .material-symbols-outlined { font-size: 16px; color: var(--outline-variant); }

/* Empty-state khi bộ lọc danh mục không khớp bài viết nào */
.empty-state {
  text-align: center;
  padding: 64px 20px;
  color: var(--on-surface-variant);
}
.empty-icon { font-size: 48px; color: var(--outline-variant); display: block; margin: 0 auto 16px; }
</style>