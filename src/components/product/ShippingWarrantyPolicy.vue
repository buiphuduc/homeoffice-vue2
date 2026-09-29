<template>
  <div>
    <collapsible-section :title="shipping.title" start-expanded>
      <p>{{ shipping.intro }}</p>

      <!-- Bảng phí gọn: lấy thẳng từ trang Chính sách vận chuyển (1 nguồn dữ liệu duy nhất,
           sửa phí ở src/content/legalPages.js thì cả 2 nơi tự đổi theo) -->
      <div class="fee-block" v-for="(t, i) in shippingTables" :key="'ft' + i">
        <div class="fee-title">{{ t.heading }}</div>
        <p class="fee-note" v-if="t.note">{{ t.note }}</p>
        <div class="fee-table-wrap">
          <table class="fee-table">
            <thead>
              <tr><th v-for="(h, k) in t.table.head" :key="k">{{ h }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="(row, r) in t.table.rows" :key="r">
                <td v-for="(cell, c) in row" :key="c">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p>{{ shipping.confirmationNote }}</p>
      <p><router-link :to="{ name: 'legal-page', params: { slug: 'van-chuyen' } }" class="full-policy-link">Xem bảng phí vận chuyển đầy đủ →</router-link></p>
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
      <p><router-link :to="{ name: 'legal-page', params: { slug: 'bao-hanh' } }" class="full-policy-link">Xem chính sách bảo hành đầy đủ →</router-link></p>
    </collapsible-section>
  </div>
</template>

<script>
import CollapsibleSection from '@/components/common/CollapsibleSection.vue';
import siteContent from '@/content/siteContent';
import legalPages from '@/content/legalPages';

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
  computed: {
    // Các bảng phí (xe máy, hàng cồng kềnh) lấy từ trang /chinh-sach/van-chuyen
    shippingTables() {
      const page = legalPages.find((p) => p.slug === 'van-chuyen');
      if (!page) return [];
      return page.sections
        .filter((sec) => (sec.blocks || []).some((b) => b.type === 'table'))
        .map((sec) => ({
          heading: sec.heading,
          note: ((sec.blocks.find((b) => b.type === 'p')) || {}).text || '',
          table: sec.blocks.find((b) => b.type === 'table'),
        }));
    },
  },
};
</script>

<style scoped>
.fee-block{margin:14px 0;}
.fee-title{font-weight:700;font-size:13.5px;color:var(--ink);margin-bottom:4px;}
.fee-note{margin:0 0 8px;font-size:12.5px;line-height:1.6;color:var(--ink-soft);}
.fee-table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;}
.fee-table{width:100%;border-collapse:collapse;font-size:12.5px;line-height:1.5;}
.fee-table th,.fee-table td{padding:8px 10px;text-align:left;border-bottom:1px solid var(--line);}
.fee-table th{background:var(--primary-light);font-weight:600;color:var(--ink);}
.fee-table td:first-child{font-weight:600;color:var(--ink);white-space:nowrap;}
.fee-table tr:last-child td{border-bottom:none;}
.full-policy-link{color:var(--primary,#715b3e);font-weight:600;text-decoration:underline;text-underline-offset:2px;}
.warranty-section{margin-bottom:16px;padding-bottom:16px;border-bottom:1px dashed var(--line);}
.warranty-section:last-of-type{border-bottom:none;}
ul{padding-left:18px;list-style:disc;}
li{margin-bottom:4px;}
</style>
