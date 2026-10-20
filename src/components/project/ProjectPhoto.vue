<template>
  <figure class="pp">
    <component
      :is="clickable ? 'button' : 'div'"
      v-bind="clickable ? { type: 'button' } : {}"
      class="pp-frame"
      :class="{ 'is-clickable': clickable }"
      :aria-label="clickable ? 'Xem ảnh này ở vị trí đầu tiên' : null"
      @click="clickable && $emit('select')"
    >
      <img
        v-if="!placeholder && image.src"
        :src="image.src"
        :alt="image.alt"
        loading="lazy"
        decoding="async"
        @error="$emit('broken', image.src)"
      >
      <span v-else class="pp-ph" aria-hidden="true"><i class="fa-solid fa-image"></i></span>
      <span v-if="clickable && !placeholder" class="pp-hint" aria-hidden="true"><i class="fa-solid fa-expand"></i></span>
    </component>
    <figcaption v-if="image.caption && !placeholder" class="pp-cap">{{ image.caption }}</figcaption>
  </figure>
</template>

<script>
/**
 * Một ảnh trong thư viện ảnh dự án. Tỉ lệ khung lấy từ biến CSS --ratio
 * do ô cha đặt (xem ProjectSpaceGallery). Ảnh lỗi báo ra ngoài qua
 * sự kiện "broken"; bấm ảnh phát sự kiện "select".
 */
export default {
  name: 'ProjectPhoto',
  props: {
    image: { type: Object, required: true },
    placeholder: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.pp { margin: 0; width: 100%; }
.pp-frame {
  position: relative; display: block; width: 100%; padding: 0; border: none; overflow: hidden;
  aspect-ratio: var(--ratio, 4 / 3); border-radius: 6px; background: var(--primary-light);
  font: inherit; text-align: inherit;
}
.pp-frame.is-clickable { cursor: pointer; }
.pp-frame img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
.pp-frame.is-clickable:hover img { transform: scale(1.04); }
.pp-frame:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.pp-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.pp-ph i { font-size: 36px; color: #d8d1c5; }
.pp-hint {
  position: absolute; right: 10px; bottom: 10px; width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255, 255, 255, .92); color: var(--ink); font-size: 12px;
  display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s;
}
.pp-frame.is-clickable:hover .pp-hint, .pp-frame.is-clickable:focus-visible .pp-hint { opacity: 1; }
.pp-cap { margin-top: 10px; font-size: 13px; line-height: 1.5; color: var(--ink-soft); font-style: italic; }
@media (hover: none) { .pp-hint { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .pp-frame img, .pp-hint { transition: none; }
  .pp-frame.is-clickable:hover img { transform: none; }
}
</style>
