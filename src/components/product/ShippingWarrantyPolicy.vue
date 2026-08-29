<template>
  <div>
    <collapsible-section :title="shipping.title" start-expanded>
      <p>{{ shipping.intro }}</p>

      <div class="policy-image-slot" v-for="(img, i) in shipping.images" :key="'si' + i">
        <img v-if="img" :src="img" :alt="shipping.title + ' ' + (i + 1)">
        <div v-else class="policy-image-placeholder">
          <i class="fa-regular fa-image"></i>
          <span>Ảnh chính sách vận chuyển #{{ i + 1 }} — dán URL ảnh vào <code>src/content/siteContent.js</code> (mục <code>shippingPolicy.images</code>)</span>
        </div>
      </div>

      <p>{{ shipping.confirmationNote }}</p>
    </collapsible-section>

    <collapsible-section :title="warranty.title">
      <p>{{ warranty.intro }}</p>

      <div v-for="(section, i) in warranty.sections" :key="'ws' + i" class="warranty-section">
        <b>{{ section.heading }}</b>
        <p style="margin:8px 0 4px;">Được bảo hành miễn phí:</p>
        <ul>
          <li v-for="(item, j) in section.covered" :key="'wc' + i + j">{{ item }}</li>
        </ul>
        <p style="margin:8px 0 4px;">Không được bảo hành miễn phí:</p>
        <ul>
          <li v-for="(item, j) in section.notCovered" :key="'wn' + i + j">{{ item }}</li>
        </ul>
      </div>

      <p>{{ warranty.contactNote }}</p>
    </collapsible-section>
  </div>
</template>

<script>
import CollapsibleSection from '@/components/common/CollapsibleSection.vue';
import siteContent from '@/content/siteContent';

/**
 * Hiển thị "Chính sách vận chuyển" + "Chính sách bảo hành" — nội dung
 * DÙNG CHUNG cho mọi trang chi tiết sản phẩm (đúng như site gốc, vì
 * chính sách áp dụng như nhau cho cả catalog). Nội dung lấy từ
 * src/content/siteContent.js — sửa ở đó, mọi trang sản phẩm tự cập
 * nhật theo, không cần lặp lại dữ liệu cho từng sản phẩm.
 */
export default {
  name: 'ShippingWarrantyPolicy',
  components: { CollapsibleSection },
  data() {
    return {
      shipping: siteContent.shippingPolicy,
      warranty: siteContent.warrantyPolicy,
    };
  },
};
</script>

<style scoped>
.policy-image-slot{margin:14px 0;}
.policy-image-slot img{width:100%;border-radius:8px;border:1px solid var(--line);}
.policy-image-placeholder{
  display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;
  border:2px dashed var(--line);border-radius:8px;padding:36px 20px;color:var(--ink-soft);background:#fafaf5;
}
.policy-image-placeholder i{font-size:32px;color:var(--line);}
.policy-image-placeholder span{font-size:12.5px;max-width:420px;line-height:1.6;}
.policy-image-placeholder code{background:#eee;padding:1px 5px;border-radius:4px;font-size:11.5px;}
.warranty-section{margin-bottom:16px;padding-bottom:16px;border-bottom:1px dashed var(--line);}
.warranty-section:last-of-type{border-bottom:none;}
ul{padding-left:18px;list-style:disc;}
li{margin-bottom:4px;}
</style>
