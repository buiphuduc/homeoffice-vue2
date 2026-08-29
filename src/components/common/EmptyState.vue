<template>
  <div class="empty-state">
    <i :class="icon"></i>
    <p>{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script>
/**
 * Khối "trống" dùng chung cho: giỏ hàng trống, không có sản phẩm,
 * không tìm thấy kết quả... Dùng <slot> để nơi gọi tự thêm nút hành
 * động phù hợp (vd "Về trang chủ", "Xóa bộ lọc"...).
 */
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'fa-solid fa-box-open',
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
