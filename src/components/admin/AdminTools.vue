<template>
  <div class="adm-tools">
    <section class="adm-card">
      <h3>Tình trạng dữ liệu</h3>
      <p class="adm-hint" v-if="loadingStats">Đang kiểm tra...</p>
      <ul class="adm-stats" v-else>
        <li><b>{{ counts.products }}</b> sản phẩm trong cơ sở dữ liệu</li>
        <li><b>{{ counts.projects }}</b> dự án trong cơ sở dữ liệu</li>
      </ul>
      <p class="adm-alert adm-alert-err" v-if="statsError">{{ statsError }}</p>
    </section>

    <section class="adm-card">
      <h3>Nhập dữ liệu có sẵn (làm 1 lần khi mới cài)</h3>
      <div class="adm-tool-row">
        <button type="button" class="adm-btn adm-btn-primary" :disabled="busy" @click="importProducts">Nhập sản phẩm từ file CSV</button>
        <label class="adm-check"><input type="checkbox" v-model="overwrite"> <span>Ghi đè cả sản phẩm đã có (mặc định: bỏ qua mã đã có)</span></label>
      </div>
      <div class="adm-tool-row">
        <button type="button" class="adm-btn adm-btn-primary" :disabled="busy" @click="importProjects">Nhập 3 dự án mẫu</button>
      </div>
    </section>

    <section class="adm-card">
      <h3>Xuất danh sách sản phẩm (.csv)</h3>
      <div class="adm-tool-row">
        <button type="button" class="adm-btn adm-btn-primary" :disabled="busy" @click="exportCsv">Tải danh sách sản phẩm (.csv)</button>
        <label class="adm-check"><input type="checkbox" v-model="fullImageUrl"> <span>Đường dẫn ảnh đầy đủ (https://tên-miền/…) — dùng khi đưa lên Google Merchant, Facebook Catalog</span></label>
      </div>
    </section>

    <section class="adm-card">
      <h3>Sao lưu &amp; khôi phục</h3>
      <div class="adm-tool-row">
        <button type="button" class="adm-btn" :disabled="busy" @click="backup">Tải bản sao lưu (.json)</button>
        <label class="adm-btn" :class="{ 'is-disabled': busy }">
          Khôi phục từ file sao lưu
          <input type="file" accept="application/json,.json" hidden :disabled="busy" @change="restore">
        </label>
      </div>
    </section>

    <section class="adm-card">
      <h3>Lưu ý</h3>
      <ul class="adm-notes">
        <li>Thêm/sửa/xóa ở đây <b>có hiệu lực ngay</b> trên website, không cần build lại. Khách đang mở trang chỉ cần tải lại trang.</li>
        </ul>
    </section>

    <p class="adm-alert" :class="msgType === 'err' ? 'adm-alert-err' : 'adm-alert-ok'" v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import Papa from 'papaparse';
import config from '@/config';
import * as sb from '@/services/api';
import { projects as sampleProjects } from '@/content/projects';

const CHUNK = 100;

// Thứ tự cột của file products.csv (giữ nguyên để chép đè vào public/data/products.csv được ngay)
const CSV_COLUMNS = ["ID", "SKU", "Name", "Slug", "Categories", "Material", "Length", "Width", "Height", "Colors", "Regular price", "Sale price", "Rating", "Review count", "Warranty (months)", "Delivery time", "In stock", "Published", "Status", "Images", "Short description", "Description", "Prompt 1 - Anh chinh (Hero)", "Prompt 2 - Goc nghieng 3-4", "Prompt 3 - Phoi canh phong cach Viet Nam", "Prompt 4 - Phoi canh phong cach Viet Nam (can canh)", "Prompt 5 - Phoi canh khong gian rong Viet Nam", "Prompt 6 - Goc dac trung"];

export default {
  name: 'AdminTools',
  data() {
    return {
      busy: false, overwrite: false, fullImageUrl: false, msg: '', msgType: 'ok',
      counts: { products: 0, projects: 0 }, loadingStats: true, statsError: '',
    };
  },
  created() { this.stats(); },
  methods: {
    say(text, type = 'ok') { this.msg = text; this.msgType = type; },
    async stats() {
      this.loadingStats = true;
      this.statsError = '';
      try {
        const [p, j] = await Promise.all([
          sb.select('products', { columns: 'sku' }),
          sb.select('projects', { columns: 'slug' }),
        ]);
        this.counts = { products: (p || []).length, projects: (j || []).length };
      } catch (e) {
        this.statsError = e.message;
      } finally {
        this.loadingStats = false;
      }
    },
    async upsertChunks(table, key, rows) {
      for (let i = 0; i < rows.length; i += CHUNK) {
        await sb.upsert(table, key, rows.slice(i, i + CHUNK)); // eslint-disable-line no-await-in-loop
      }
    },
    async importProducts() {
      this.busy = true; this.msg = '';
      try {
        const res = await fetch(config.sheetCsvUrl || '/data/products.csv');
        if (!res.ok) throw new Error('Không tải được file CSV sản phẩm.');
        const text = (await res.text()).replace(/^\uFEFF/, '');
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data.filter((r) => r.SKU && r.Name);
        const existing = {};
        (await sb.select('products', { columns: 'sku' }) || []).forEach((r) => { existing[r.sku] = true; });
        const rows = parsed
          .map((data, i) => ({ sku: data.SKU.trim(), data, sort_order: i, updated_at: new Date().toISOString() }))
          .filter((r) => this.overwrite || !existing[r.sku]);
        await this.upsertChunks('products', 'sku', rows);
        this.say(`Đã nhập ${rows.length} sản phẩm (bỏ qua ${parsed.length - rows.length} mã đã có).`);
        this.$store.dispatch('products/fetchProducts');
        await this.stats();
      } catch (e) {
        this.say(e.message, 'err');
      } finally {
        this.busy = false;
      }
    },
    async importProjects() {
      this.busy = true; this.msg = '';
      try {
        const existing = {};
        (await sb.select('projects', { columns: 'slug' }) || []).forEach((r) => { existing[r.slug] = true; });
        const rows = sampleProjects
          .map((p, i) => ({ slug: p.slug, data: p, sort_order: i, updated_at: new Date().toISOString() }))
          .filter((r) => !existing[r.slug]);
        await this.upsertChunks('projects', 'slug', rows);
        this.say(`Đã nhập ${rows.length} dự án mẫu (bỏ qua ${sampleProjects.length - rows.length} dự án đã có).`);
        this.$store.dispatch('projects/fetch', { force: true });
        await this.stats();
      } catch (e) {
        this.say(e.message, 'err');
      } finally {
        this.busy = false;
      }
    },
    // Xuất toàn bộ sản phẩm ra CSV (cột đúng thứ tự file products.csv; cột lạ nếu có thì nối thêm cuối)
    async exportCsv() {
      this.busy = true; this.msg = '';
      try {
        const rows = (await sb.select('products', { authed: true })) || [];
        if (!rows.length) throw new Error('Chưa có sản phẩm nào để xuất.');
        const extra = [];
        rows.forEach((r) => Object.keys(r.data || {}).forEach((k) => {
          if (CSV_COLUMNS.indexOf(k) === -1 && extra.indexOf(k) === -1) extra.push(k);
        }));
        const fields = CSV_COLUMNS.concat(extra);
        const origin = window.location.origin;
        const data = rows.map((r) => {
          const d = { ...(r.data || {}), SKU: r.sku };
          if (this.fullImageUrl && d.Images) {
            d.Images = String(d.Images).split(',').map((u) => u.trim()).filter(Boolean)
              .map((u) => (u.charAt(0) === '/' ? origin + u : u)).join(', ');
          }
          return fields.map((f) => (d[f] == null ? '' : String(d[f])));
        });
        const csv = `\uFEFF${Papa.unparse({ fields, data })}`; // BOM để Excel đọc đúng tiếng Việt
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        this.say(`Đã xuất ${rows.length} sản phẩm ra file CSV.`);
      } catch (e) {
        this.say(e.message, 'err');
      } finally {
        this.busy = false;
      }
    },
    async backup() {
      this.busy = true; this.msg = '';
      try {
        const [products, projects] = await Promise.all([
          sb.select('products', { authed: true }),
          sb.select('projects', { authed: true }),
        ]);
        const blob = new Blob(
          [JSON.stringify({ exported_at: new Date().toISOString(), products, projects }, null, 2)],
          { type: 'application/json' },
        );
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `htm-sao-luu-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        this.say(`Đã tải bản sao lưu: ${products.length} sản phẩm, ${projects.length} dự án.`);
      } catch (e) {
        this.say(e.message, 'err');
      } finally {
        this.busy = false;
      }
    },
    async restore(e) {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (!window.confirm('Khôi phục sẽ ghi đè các sản phẩm/dự án trùng mã trong file sao lưu. Tiếp tục?')) return;
      this.busy = true; this.msg = '';
      try {
        const json = JSON.parse(await file.text());
        const products = (json.products || []).filter((r) => r.sku);
        const projects = (json.projects || []).filter((r) => r.slug);
        await this.upsertChunks('products', 'sku', products);
        await this.upsertChunks('projects', 'slug', projects);
        this.say(`Đã khôi phục ${products.length} sản phẩm và ${projects.length} dự án.`);
        this.$store.dispatch('products/fetchProducts');
        this.$store.dispatch('projects/fetch', { force: true });
        await this.stats();
      } catch (err) {
        this.say(err.message || 'File sao lưu không hợp lệ.', 'err');
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
