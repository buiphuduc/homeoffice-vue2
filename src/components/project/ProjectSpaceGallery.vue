<template>
  <div class="sg" ref="root">
    <!-- 1 ảnh -->
    <div v-if="mode === 'single'" class="sg-single" style="--ratio: 16 / 9">
      <project-photo :image="shown[0].img" :placeholder="shown[0].ph" @broken="markFailed"></project-photo>
    </div>

    <!-- feature: ảnh đầu to (2 cột) + các ảnh còn lại -->
    <div v-else-if="mode === 'feature'" class="sg-feature">
      <div
        v-for="(it, i) in shown"
        :key="it.img.src"
        class="sg-cell"
        :class="i === 0 ? 'is-lead' : i === 1 ? 'is-tall' : 'is-sq'"
      >
        <project-photo
          :image="it.img" :placeholder="it.ph" :clickable="i > 0"
          @select="promote(it.img.src)" @broken="markFailed"
        ></project-photo>
      </div>
    </div>

    <!-- grid: lưới 2 cột -->
    <div v-else-if="mode === 'grid'" class="sg-grid" :style="{ '--ratio': shown.length <= 2 ? '16 / 10' : '4 / 3' }">
      <div v-for="(it, i) in shown" :key="it.img.src" class="sg-cell">
        <project-photo
          :image="it.img" :placeholder="it.ph" :clickable="i > 0"
          @select="promote(it.img.src)" @broken="markFailed"
        ></project-photo>
      </div>
    </div>

    <!-- split: ảnh chính bên trái + 2 ảnh xếp dọc bên phải, ảnh còn lại bên dưới -->
    <div v-else class="sg-split-wrap">
      <div class="sg-split">
        <div class="sg-main" style="--ratio: 16 / 11">
          <project-photo :image="shown[0].img" :placeholder="shown[0].ph" @broken="markFailed"></project-photo>
        </div>
        <div class="sg-side" style="--ratio: 16 / 9">
          <project-photo
            v-for="it in shown.slice(1, 3)" :key="it.img.src"
            :image="it.img" :placeholder="it.ph" clickable
            @select="promote(it.img.src)" @broken="markFailed"
          ></project-photo>
        </div>
      </div>
      <div class="sg-rest" v-if="shown.length > 3" style="--ratio: 4 / 3">
        <project-photo
          v-for="it in shown.slice(3)" :key="it.img.src"
          :image="it.img" :placeholder="it.ph" clickable
          @select="promote(it.img.src)" @broken="markFailed"
        ></project-photo>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectPhoto from './ProjectPhoto.vue';

/**
 * Thư viện ảnh của 1 không gian trong dự án, bố cục theo mẫu thiết kế:
 *   layout "feature" — ảnh đầu to + các ảnh nhỏ
 *   layout "grid"    — lưới 2 cột
 *   layout "split"   — ảnh chính + 2 ảnh xếp dọc bên phải
 * TÍNH NĂNG: bấm vào 1 ảnh nhỏ -> ảnh đó được đưa lên VỊ TRÍ ĐẦU TIÊN
 * (khung lớn), ảnh đang ở vị trí đầu đổi chỗ xuống — giống cách chọn ảnh
 * ở trang chi tiết sản phẩm.
 * Ảnh chưa có file tự ẩn; không còn ảnh nào thì hiện khung trống giữ nguyên bố cục.
 */
export default {
  name: 'ProjectSpaceGallery',
  components: { ProjectPhoto },
  props: {
    images: { type: Array, default: () => [] }, // [{ src, alt, caption }]
    layout: { type: String, default: '' },
    offset: { type: Number, default: 150 }, // chiều cao vùng dính phía trên, để cuộn không bị che
  },
  data() {
    return {
      order: this.images.map((i) => i.src), // thứ tự hiển thị hiện tại (theo src)
      failed: {},
    };
  },
  computed: {
    bySrc() {
      const m = {};
      this.images.forEach((i) => { m[i.src] = i; });
      return m;
    },
    all() {
      return this.order.map((src) => this.bySrc[src]).filter(Boolean);
    },
    visible() {
      return this.all.filter((i) => !this.failed[i.src]);
    },
    // Không còn ảnh nào tải được -> vẫn dựng khung bằng các ô trống
    shown() {
      if (this.visible.length) return this.visible.map((img) => ({ img, ph: false }));
      return this.all.map((img) => ({ img, ph: true }));
    },
    mode() {
      const n = this.shown.length;
      if (n <= 1) return 'single';
      if (this.layout === 'split') return 'split';
      if (this.layout === 'feature' && n >= 3) return 'feature';
      if (this.layout === '' && n >= 5) return 'feature';
      return 'grid';
    },
  },
  watch: {
    images() {
      this.order = this.images.map((i) => i.src);
      this.failed = {};
    },
  },
  methods: {
    markFailed(src) {
      if (!src || this.failed[src]) return;
      this.$set(this.failed, src, true);
    },
    // Đưa ảnh vừa bấm lên đầu tiên (đổi chỗ với ảnh đang ở đầu)
    promote(src) {
      const i = this.order.indexOf(src);
      if (i <= 0) return;
      const next = this.order.slice();
      const first = next[0];
      next[0] = next[i];
      next[i] = first;
      this.order = next;
      this.$nextTick(this.keepMainInView);
    },
    // Nếu đầu khu vực đã trôi lên khuất sau thanh dính thì cuộn lại để thấy ảnh vừa chọn
    keepMainInView() {
      const el = this.$refs.root;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < this.offset) {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: window.scrollY + top - this.offset, behavior: reduce ? 'auto' : 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
.sg-feature, .sg-grid, .sg-split, .sg-rest { display: grid; grid-template-columns: 1fr; gap: 24px; }
.sg-split-wrap { display: flex; flex-direction: column; gap: 24px; }
.sg-side { display: flex; flex-direction: column; gap: 24px; }
.sg-cell, .sg-main { min-width: 0; }
.is-lead { --ratio: 16 / 10; }
.is-tall { --ratio: 1 / 1; }
.is-sq { --ratio: 1 / 1; }

@media (min-width: 768px) {
  .sg-feature { grid-template-columns: repeat(3, 1fr); }
  .sg-feature .is-lead { grid-column: span 2; }
  .sg-feature .is-tall { --ratio: 4 / 5; }
  .sg-grid { grid-template-columns: repeat(2, 1fr); }
  .sg-split { grid-template-columns: 7fr 5fr; align-items: start; }
  .sg-rest { grid-template-columns: repeat(3, 1fr); }
}
</style>
