<template>
  <div class="gallery">
    <div
      class="gallery-main"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <img v-if="currentImage" :src="currentImage" :alt="altText">
      <i v-else class="fa-solid fa-couch gallery-placeholder-icon"></i>

      <!-- Mũi tên chuyển ảnh — chỉ hiện khi có từ 2 ảnh trở lên -->
      <template v-if="images.length > 1">
        <button class="gallery-arrow left" @click="prev" aria-label="Ảnh trước">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="gallery-arrow right" @click="next" aria-label="Ảnh sau">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        <span class="gallery-counter">{{ activeIndex + 1 }} / {{ images.length }}</span>
      </template>
    </div>

    <!-- Chấm tròn báo vị trí ảnh — chủ yếu để dùng trên di động khi lướt (swipe) -->
    <div class="gallery-dots" v-if="images.length > 1">
      <span
        v-for="(img, i) in images"
        :key="'dot' + i"
        :class="{ active: i === activeIndex }"
        @click="goTo(i)"
      ></span>
    </div>

    <!-- Dãy ảnh nhỏ để bấm chọn nhanh — hữu ích trên màn hình rộng (desktop) -->
    <div class="pd-thumbs" v-if="images.length > 1">
      <div
        class="t"
        :class="{ active: i === activeIndex }"
        v-for="(img, i) in images"
        :key="'thumb' + i"
        @click="goTo(i)"
      >
        <img :src="img">
      </div>
    </div>
  </div>
</template>

<script>
/**
 * src/components/product/ProductGallery.vue
 * ------------------------------------------------------------------
 * Gallery ảnh sản phẩm hỗ trợ 3 cách xem cho khách hàng "lướt qua" ảnh:
 *   1. Vuốt trái/phải trên di động (touch swipe)
 *   2. Bấm mũi tên trái/phải (desktop + mobile)
 *   3. Bấm trực tiếp vào ảnh nhỏ (thumbnail) hoặc chấm tròn (dot)
 * Component nhận vào 1 mảng URL ảnh, tự quản lý ảnh nào đang active —
 * nơi gọi (ProductDetailView, QuickViewModal) không cần biết logic bên trong.
 * ------------------------------------------------------------------
 */
export default {
  name: 'ProductGallery',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    altText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeIndex: 0,
      touchStartX: 0,
    };
  },
  computed: {
    currentImage() {
      return this.images[this.activeIndex] || null;
    },
  },
  watch: {
    // Khi component cha đổi sản phẩm (đổi mảng images), luôn quay về ảnh đầu tiên
    images() {
      this.activeIndex = 0;
    },
  },
  methods: {
    goTo(i) {
      this.activeIndex = i;
    },
    next() {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    },
    prev() {
      this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    },
    onTouchStart(e) {
      this.touchStartX = e.changedTouches[0].clientX;
    },
    onTouchEnd(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - this.touchStartX;
      const SWIPE_THRESHOLD = 40; // vuốt tối thiểu 40px mới tính là swipe, tránh nhầm với chạm nhẹ
      if (Math.abs(diff) < SWIPE_THRESHOLD || this.images.length < 2) return;
      if (diff < 0) {
        this.next(); // vuốt sang trái -> ảnh kế tiếp
      } else {
        this.prev(); // vuốt sang phải -> ảnh trước đó
      }
    },
  },
};
</script>
