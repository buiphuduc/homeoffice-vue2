<template>
  <div class="adm-modal-back" @mousedown.self="$emit('close')">
    <div class="adm-modal" :class="{ wide }" role="dialog" aria-modal="true" :aria-label="title">
      <header class="adm-modal-head">
        <h2>{{ title }}</h2>
        <button type="button" class="adm-x" aria-label="Đóng" @click="$emit('close')">&times;</button>
      </header>
      <div class="adm-modal-body"><slot></slot></div>
      <footer class="adm-modal-foot"><slot name="footer"></slot></footer>
    </div>
  </div>
</template>

<script>
/** Khung cửa sổ nổi dùng trong trang quản trị. Bấm nền tối hoặc dấu × để đóng. */
export default {
  name: 'AdminModal',
  props: {
    title: { type: String, default: '' },
    wide: { type: Boolean, default: false },
  },
  mounted() {
    document.body.style.overflow = 'hidden';
  },
  beforeDestroy() {
    document.body.style.overflow = '';
  },
};
</script>
