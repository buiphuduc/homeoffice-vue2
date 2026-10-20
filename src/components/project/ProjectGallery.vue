<template>
  <div class="gallery project-gallery">
    <div
      class="gallery-main"
      tabindex="0"
      role="group"
      :aria-label="'Thư viện ảnh ' + label"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
      @keydown.left.prevent="prev"
      @keydown.right.prevent="next"
    >
      <img
        v-if="current"
        :key="current.src"
        :src="current.src"
        :alt="current.alt"
        @error="onMainError"
      >
      <div v-else class="pg-empty">
        <i class="fa-solid fa-image"></i>
        <span>Ảnh đang cập nhật</span>
      </div>

      <template v-if="visible.length > 1">
        <button type="button" class="gallery-arrow left" @click="prev" aria-label="Ảnh trước">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" class="gallery-arrow right" @click="next" aria-label="Ảnh sau">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </template>
      <span class="gallery-counter" v-if="visible.length > 1">{{ activeIndex + 1 }} / {{ visible.length }}</span>
    </div>

    <p class="pg-caption" v-if="current && current.caption">{{ current.caption }}</p>

    <!-- Dãy ảnh nhỏ: bấm vào ảnh nào thì ảnh đó hiện lên khung lớn phía trên -->
    <div class="pd-thumbs" ref="thumbs" v-if="visible.length > 1">
      <button
        type="button"
        class="t"
        :class="{ active: i === activeIndex }"
        v-for="(img, i) in visible"
        :key="'t' + img.src"
        :aria-label="'Xem ảnh ' + (i + 1)"
        :aria-current="i === activeIndex ? 'true' : null"
        @click="select(i)"
      >
        <img :src="img.src" alt="" loading="lazy" @error="markFailed(img.src)">
      </button>
    </div>
  </div>
</template>

<script>
/**
 * src/components/project/ProjectGallery.vue
 * ------------------------------------------------------------------
 * Thư viện ảnh của 1 không gian trong dự án — cùng kiểu với gallery ở
 * trang chi tiết sản phẩm: 1 khung ảnh lớn ở trên + dãy ảnh nhỏ bên
 * dưới. Bấm ảnh nhỏ nào thì ảnh đó hiện lên khung lớn. Ngoài ra có
 * mũi tên, phím ← →, vuốt trái/phải trên điện thoại.
 * Ảnh chưa có file (lỗi tải) tự ẩn; không còn ảnh nào thì hiện
 * "Ảnh đang cập nhật".
 * Dùng lại class chung .gallery, .gallery-main, .pd-thumbs trong main.css.
 * ------------------------------------------------------------------
 */
export default {
  name: 'ProjectGallery',
  props: {
    images: { type: Array, default: () => [] }, // [{ src, alt, caption }]
    label: { type: String, default: '' },
  },
  data() {
    return {
      activeIndex: 0,
      touchStartX: 0,
      failed: {},
    };
  },
  computed: {
    visible() {
      return this.images.filter((img) => !this.failed[img.src]);
    },
    current() {
      return this.visible[this.activeIndex] || null;
    },
  },
  watch: {
    images() {
      this.activeIndex = 0;
    },
  },
  methods: {
    // Lấy đúng URL của ảnh vừa lỗi từ chính thẻ <img> (không dựa vào ảnh đang chọn),
    // tránh đánh dấu nhầm ảnh khác khi nhiều sự kiện lỗi nổ liên tiếp
    onMainError(e) {
      this.markFailed(e.target && e.target.getAttribute('src'));
    },
    markFailed(src) {
      if (!src || this.failed[src]) return;
      this.$set(this.failed, src, true);
      if (this.activeIndex >= this.visible.length) this.activeIndex = 0;
    },
    select(i) {
      this.activeIndex = i;
      this.scrollThumbIntoView();
    },
    next() {
      if (this.visible.length < 2) return;
      this.select((this.activeIndex + 1) % this.visible.length);
    },
    prev() {
      if (this.visible.length < 2) return;
      this.select((this.activeIndex - 1 + this.visible.length) % this.visible.length);
    },
    scrollThumbIntoView() {
      this.$nextTick(() => {
        const box = this.$refs.thumbs;
        if (!box) return;
        const el = box.children[this.activeIndex];
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      });
    },
    onTouchStart(e) {
      this.touchStartX = e.changedTouches[0].clientX;
    },
    onTouchEnd(e) {
      const diff = e.changedTouches[0].clientX - this.touchStartX;
      if (Math.abs(diff) < 40) return; // vuốt tối thiểu 40px mới tính
      if (diff < 0) this.next(); else this.prev();
    },
  },
};
</script>

<style scoped>
/* Khung ảnh ngang (ảnh nội thất thường là ảnh ngang) thay cho khung vuông của sản phẩm */
.project-gallery .gallery-main { aspect-ratio: 3 / 2; max-height: 78vh; outline: none; }
.project-gallery .gallery-main:focus-visible { box-shadow: 0 0 0 2px var(--primary); }
.project-gallery .gallery-main img { object-fit: cover; }
.pg-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--ink-soft); font-size: 14px; }
.pg-empty i { font-size: 44px; color: var(--line); }
.pg-caption { margin: 10px 2px 0; font-size: 13.5px; color: var(--ink-soft); }

/* Dãy ảnh nhỏ luôn hiện (cả di động), cuộn ngang khi có nhiều ảnh; không dùng chấm tròn */
.project-gallery .gallery-dots { display: none; }
.project-gallery .pd-thumbs {
  display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 8px; padding-bottom: 6px;
  scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch;
}
.project-gallery .pd-thumbs .t {
  flex: 0 0 auto; width: 84px; height: 64px; padding: 0; background: var(--primary-light);
  scroll-snap-align: center; border-radius: 7px; border: 2px solid var(--line); overflow: hidden; cursor: pointer;
  opacity: .78; transition: opacity .2s, border-color .2s;
}
.project-gallery .pd-thumbs .t:hover { opacity: 1; }
.project-gallery .pd-thumbs .t.active { border-color: var(--primary); opacity: 1; }
.project-gallery .pd-thumbs .t:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
@media (min-width: 900px) {
  .project-gallery .pd-thumbs .t { width: 108px; height: 76px; }
}
@media (prefers-reduced-motion: reduce) {
  .project-gallery .pd-thumbs .t { transition: none; }
}
</style>
