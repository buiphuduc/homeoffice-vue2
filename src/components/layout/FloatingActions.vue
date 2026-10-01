<template>
  <div class="fab-col" :style="viewportStyle">
    <a
      v-if="config.zaloPhone"
      class="fab fab-zalo"
      :href="'https://zalo.me/' + config.zaloPhone"
      target="_blank"
      rel="noopener"
      title="Chat Zalo"
    >
      <i class="fa-solid fa-comment-dots"></i>
    </a>
    <a
      v-if="config.messengerUsername"
      class="fab fab-messenger"
      :href="'https://m.me/' + config.messengerUsername"
      target="_blank"
      rel="noopener"
      title="Chat Messenger"
    >
      <i class="fa-brands fa-facebook-messenger"></i>
    </a>
    <a
      v-if="config.hotlineTel"
      class="fab fab-call"
      :href="'tel:' + config.hotlineTel"
      title="Gọi ngay"
    >
      <i class="fa-solid fa-phone"></i>
    </a>
    <button
      class="fab fab-top"
      v-show="showScrollTop"
      title="Lên đầu trang"
      @click="scrollToTop"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  </div>
</template>

<script>
import config from '@/config';

/**
 * Cột nút nổi góc phải màn hình — luôn hiển thị ở MỌI trang (đặt trong
 * App.vue), giống hệt cụm nút Zalo/Messenger/Gọi/Lên đầu trang ở site
 * gốc. Nút "Lên đầu trang" chỉ hiện khi người dùng đã cuộn xuống 1
 * đoạn, tránh che nội dung lúc mới vào trang.
 */
export default {
  name: 'FloatingActions',
  data() {
    return {
      config,
      showScrollTop: false,
      viewportStyle: {},
    };
  },
  mounted() {
    this.handleScroll();
    this.updateViewport();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.updateViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.updateViewport);
      window.visualViewport.addEventListener('scroll', this.updateViewport);
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.updateViewport);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.updateViewport);
      window.visualViewport.removeEventListener('scroll', this.updateViewport);
    }
  },
  methods: {
    updateViewport() {
      const viewport = window.visualViewport;
      // Keep controls above browser chrome/the keyboard; preserve native pinch zoom.
      if (!viewport || viewport.scale !== 1) {
        this.viewportStyle = {};
        return;
      }
      this.viewportStyle = {
        '--fab-viewport-bottom': Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) + 'px',
        '--fab-viewport-height': viewport.height + 'px',
      };
    },
    handleScroll() {
      this.showScrollTop = window.scrollY > 400;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>
