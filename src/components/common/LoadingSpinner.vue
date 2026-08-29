<template>
  <div class="loading-block">
    <i class="fa-solid fa-spinner"></i>
    <p>{{ text }}</p>
  </div>
</template>

<script>
/**
 * Spinner loading dùng chung — nhận prop "text" để đổi thông báo tuỳ
 * ngữ cảnh (đang tải sản phẩm, đang tải giỏ hàng...).
 */
export default {
  name: 'LoadingSpinner',
  props: {
    text: {
      type: String,
      default: 'Đang tải...',
    },
  },
};
</script>
