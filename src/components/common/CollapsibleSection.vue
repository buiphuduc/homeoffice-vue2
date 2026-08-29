<template>
  <div class="collapsible">
    <div class="collapsible-head">
      <h3>{{ title }}</h3>
    </div>
    <div class="collapsible-body" :class="{ collapsed: !expanded && collapsible }">
      <slot></slot>
    </div>
    <button v-if="collapsible" class="collapsible-toggle" @click="expanded = !expanded">
      {{ expanded ? 'Thu gọn' : 'Xem thêm' }}
      <i class="fa-solid" :class="expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </button>
  </div>
</template>

<script>
/**
 * src/components/common/CollapsibleSection.vue
 * ------------------------------------------------------------------
 * Khối nội dung có thể "Xem thêm / Thu gọn" — dùng lại cho: mô tả sản
 * phẩm, chính sách vận chuyển, chính sách bảo hành... (đúng như site
 * gốc). Nội dung bên trong truyền qua <slot>, component này chỉ lo
 * phần khung + hành vi thu gọn, không quan tâm nội dung là gì.
 *
 * Prop "collapsible": nếu false thì hiển thị toàn bộ nội dung luôn,
 * không có nút "Xem thêm" (dùng cho nội dung ngắn không cần thu gọn).
 * Prop "startExpanded": mở sẵn ngay từ đầu hay không.
 * ------------------------------------------------------------------
 */
export default {
  name: 'CollapsibleSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    collapsible: {
      type: Boolean,
      default: true,
    },
    startExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: this.startExpanded,
    };
  },
};
</script>

<style scoped>
.collapsible{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:20px;margin-top:18px;}
.collapsible-head h3{margin:0 0 12px;font-size:15.5px;border-left:4px solid var(--primary);padding-left:10px;}
.collapsible-body{font-size:13.6px;line-height:1.8;color:#333;overflow:hidden;}
.collapsible-body.collapsed{max-height:180px;position:relative;mask-image:linear-gradient(to bottom, #000 60%, transparent 100%);}
.collapsible-toggle{
  display:flex;align-items:center;gap:6px;margin-top:12px;background:none;border:1px solid var(--line);
  border-radius:7px;padding:8px 14px;font-size:12.5px;font-weight:700;color:var(--primary);cursor:pointer;
}
.collapsible-toggle:hover{background:var(--primary-light);}
</style>
