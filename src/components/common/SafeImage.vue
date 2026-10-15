<template>
  <img v-if="src" :src="src" :alt="alt" @error="idx++">
  <span v-else class="safe-image-fallback"><slot></slot></span>
</template>

<script>
/**
 * src/components/common/SafeImage.vue
 * ------------------------------------------------------------------
 * Ảnh "an toàn": nhận danh sách URL, nếu ảnh đầu bị lỗi (file chưa có)
 * thì tự thử ảnh kế tiếp; hết ảnh thì hiện nội dung dự phòng (slot),
 * không bao giờ hiện icon ảnh vỡ.
 * ------------------------------------------------------------------
 */
export default {
  name: 'SafeImage',
  props: {
    sources: { type: Array, default: () => [] },
    alt: { type: String, default: '' },
  },
  data() {
    return { idx: 0 };
  },
  computed: {
    src() {
      return this.sources[this.idx] || null;
    },
  },
  watch: {
    sources() {
      this.idx = 0;
    },
  },
};
</script>

<style scoped>
.safe-image-fallback { display: contents; }
</style>
