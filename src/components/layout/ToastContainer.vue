<template>
  <div class="toast-wrap">
    <transition-group name="toast-fade">
      <div
        class="toast"
        :class="{ err: t.type === 'err' }"
        v-for="t in toasts"
        :key="t.id"
      >
        <div class="t-title">{{ t.title }}</div>
        <div class="t-desc" v-if="t.desc">{{ t.desc }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex';

/**
 * Hiển thị toàn bộ toast đang có trong Vuex store (module toast).
 * Component này KHÔNG có logic gì khác ngoài hiển thị — mọi nơi trong
 * app muốn hiện thông báo chỉ cần gọi:
 *   this.$store.dispatch('toast/push', { title: '...', desc: '...' })
 */
export default {
  name: 'ToastContainer',
  computed: {
    ...mapState('toast', { toasts: (state) => state.items }),
  },
};
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease;
}
.toast-fade-enter,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
