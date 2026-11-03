<template>
  <div>
    <div class="adm-bar">
      <input class="adm-input adm-search" v-model.trim="q" placeholder="Tìm theo mã hoặc tên sản phẩm...">
      <select class="adm-input" v-model="catFilter">
        <option value="">Tất cả danh mục</option>
        <option v-for="c in topCats" :key="c" :value="c">{{ c }}</option>
      </select>
      <button type="button" class="adm-btn adm-btn-primary" @click="openNew">+ Thêm sản phẩm</button>
    </div>
    <p class="adm-hint">{{ filtered.length }} sản phẩm<span v-if="hidden"> · {{ hidden }} đang ẩn</span></p>

    <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>
    <div class="adm-empty" v-if="loading">Đang tải...</div>
    <div class="adm-empty" v-else-if="!rows.length && !error">
      Chưa có sản phẩm nào trong cơ sở dữ liệu. Bấm “+ Thêm sản phẩm”, hoặc vào tab
      <b>Công cụ</b> để nhập sẵn các sản phẩm từ file CSV của website.
    </div>

    <div class="adm-table-wrap" v-else-if="rows.length">
      <table class="adm-table">
        <thead>
          <tr><th></th><th>Mã</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Hiển thị</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="r in pageRows" :key="r.sku">
            <td class="adm-td-thumb">
              <img v-if="r.thumb" :src="r.thumb" alt="" loading="lazy" @error="$event.target.style.visibility = 'hidden'">
            </td>
            <td><b>{{ r.sku }}</b></td>
            <td>{{ r.name }}</td>
            <td class="adm-muted">{{ r.cat }}</td>
            <td>{{ r.price }}</td>
            <td>
              <button type="button" class="adm-switch" :class="{ on: r.published }" :aria-pressed="r.published" @click="togglePublished(r)">
                <span></span>
              </button>
            </td>
            <td class="adm-td-actions">
              <button type="button" class="adm-btn adm-btn-sm" @click="openEdit(r)">Sửa</button>
              <button type="button" class="adm-btn adm-btn-sm" @click="openDuplicate(r)">Nhân bản</button>
              <button type="button" class="adm-btn adm-btn-sm adm-btn-danger" @click="remove(r)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="adm-pager" v-if="pageCount > 1">
      <button type="button" class="adm-btn adm-btn-sm" :disabled="page === 1" @click="page--">&lsaquo;</button>
      <span>Trang {{ page }} / {{ pageCount }}</span>
      <button type="button" class="adm-btn adm-btn-sm" :disabled="page === pageCount" @click="page++">&rsaquo;</button>
    </div>

    <!-- ===== Form thêm / sửa ===== -->
    <admin-modal v-if="form" :title="isNew ? 'Thêm sản phẩm' : 'Sửa sản phẩm ' + form.sku" wide @close="closeForm">
      <div class="adm-grid-2">
        <label class="adm-field">
          <span>Mã sản phẩm (SKU) *</span>
          <input class="adm-input" v-model.trim="form.sku" :disabled="!isNew" placeholder="VD: BLV01" maxlength="40">
          <small v-if="!isNew">Mã không đổi được sau khi tạo.</small>
        </label>
        <label class="adm-field">
          <span>Tên sản phẩm *</span>
          <input class="adm-input" v-model="form.name" placeholder="VD: Bàn làm việc modesty panel BLV01">
        </label>
      </div>

      <label class="adm-field">
        <span>Danh mục (phân cấp bằng dấu “&gt;”, nhiều danh mục cách nhau dấu phẩy)</span>
        <input class="adm-input" v-model="form.categories" list="adm-cat-list" placeholder="VD: Phòng Làm Việc > Bàn Làm Việc">
        <datalist id="adm-cat-list"><option v-for="c in catSuggestions" :key="c" :value="c"></option></datalist>
      </label>

      <div class="adm-grid-3">
        <label class="adm-field">
          <span>Giá gốc (VNĐ)</span>
          <input class="adm-input" v-model="form.price" inputmode="numeric" placeholder="Để trống = “Liên hệ”">
        </label>
        <label class="adm-field">
          <span>Giá khuyến mãi (VNĐ)</span>
          <input class="adm-input" v-model="form.salePrice" inputmode="numeric" placeholder="Nhỏ hơn giá gốc">
        </label>
        <label class="adm-field">
          <span>Bảo hành (tháng)</span>
          <input class="adm-input" v-model="form.warranty" inputmode="numeric">
        </label>
      </div>

      <div class="adm-grid-2">
        <label class="adm-field">
          <span>Tình trạng</span>
          <select class="adm-input" v-model="form.inStock">
            <option value="Yes">Còn hàng</option>
            <option value="No">Hết hàng</option>
          </select>
        </label>
        <label class="adm-field">
          <span>Hiển thị trên website</span>
          <select class="adm-input" v-model="form.published">
            <option value="Yes">Hiển thị</option>
            <option value="No">Ẩn (nháp)</option>
          </select>
        </label>
      </div>

      <label class="adm-field">
        <span>Mô tả ngắn</span>
        <textarea class="adm-input" rows="2" v-model="form.shortDesc"></textarea>
      </label>
      <label class="adm-field">
        <span>Mô tả chi tiết</span>
        <textarea class="adm-input" rows="5" v-model="form.desc"></textarea>
      </label>

      <div class="adm-field">
        <span>Hình ảnh sản phẩm (ảnh đầu tiên là ảnh chính)</span>
        <admin-image-list
          v-model="form.images"
          :folder="'products/' + safeSku"
          :prefix="safeSku || 'sp'"
          :disabled="!safeSku"
          disabled-text="Hãy nhập mã sản phẩm (SKU) trước khi tải ảnh lên."
          @uploading="onUploading"
        ></admin-image-list>
      </div>

      <details class="adm-more">
        <summary>Thông số thêm (không bắt buộc)</summary>
        <div class="adm-grid-2">
          <label class="adm-field"><span>Chất liệu</span><input class="adm-input" v-model="form.material"></label>
          <label class="adm-field"><span>Thời gian giao hàng</span><input class="adm-input" v-model="form.delivery"></label>
        </div>
        <div class="adm-grid-3">
          <label class="adm-field"><span>Dài (mm)</span><input class="adm-input" v-model="form.length" inputmode="numeric"></label>
          <label class="adm-field"><span>Rộng / sâu (mm)</span><input class="adm-input" v-model="form.width" inputmode="numeric"></label>
          <label class="adm-field"><span>Cao (mm)</span><input class="adm-input" v-model="form.height" inputmode="numeric"></label>
        </div>
        <label class="adm-field">
          <span>Màu / kiểu (mỗi màu cách nhau dấu “;”, có thể “Tên màu|URL ảnh mẫu”)</span>
          <input class="adm-input" v-model="form.colors" placeholder="VD: Trắng; Vân gỗ sồi; Xám ghi">
        </label>
      </details>

      <p class="adm-alert adm-alert-err" v-if="formError">{{ formError }}</p>
      <template slot="footer">
        <button type="button" class="adm-btn" @click="closeForm" :disabled="saving">Hủy</button>
        <button type="button" class="adm-btn adm-btn-primary" @click="save" :disabled="saving || busyUploads > 0">
          {{ saving ? 'Đang lưu...' : busyUploads > 0 ? 'Đang tải ảnh lên...' : 'Lưu sản phẩm' }}
        </button>
      </template>
    </admin-modal>
  </div>
</template>

<script>
import * as sb from '@/services/api';
import AdminModal from '@/components/admin/AdminModal.vue';
import AdminImageList from '@/components/admin/AdminImageList.vue';
import { formatVND, parseVNDNumber } from '@/utils/format';
import { safeSegment, toSlug } from '@/utils/slug';

const PAGE_SIZE = 15;

// Mọi cột của file CSV (giữ đúng tên cột để website đọc được)
function blankData() {
  return {
    ID: '', SKU: '', Name: '', Slug: '', Categories: '', Material: '', Length: '', Width: '', Height: '',
    Colors: '', 'Regular price': '', 'Sale price': '', Rating: '', 'Review count': '', 'Warranty (months)': '',
    'Delivery time': '', 'In stock': 'Yes', Published: 'Yes', Status: '', Images: '',
    'Short description': '', Description: '',
  };
}

function digits(v) {
  return String(v == null ? '' : v).replace(/[^0-9]/g, '');
}

export default {
  name: 'AdminProducts',
  components: { AdminModal, AdminImageList },
  data() {
    return {
      rows: [], loading: true, error: '',
      q: '', catFilter: '', page: 1,
      form: null, isNew: false, editing: null, originalImages: [],
      saving: false, formError: '', busyUploads: 0,
    };
  },
  computed: {
    list() {
      return this.rows.map((r) => {
        const d = r.data || {};
        const images = (d.Images || '').split(',').map((s) => s.trim()).filter(Boolean);
        const cat = (d.Categories || '').split(',')[0].trim();
        const price = parseVNDNumber(d['Regular price']);
        return {
          sku: r.sku,
          row: r,
          name: d.Name || '',
          cat,
          top: cat.split('>')[0].trim(),
          price: price > 0 ? formatVND(price) : 'Liên hệ',
          thumb: images[0] || '',
          published: String(d.Published || '').trim().toLowerCase() === 'yes',
        };
      });
    },
    topCats() {
      const set = {};
      this.list.forEach((r) => { if (r.top) set[r.top] = true; });
      return Object.keys(set).sort((a, b) => a.localeCompare(b, 'vi'));
    },
    catSuggestions() {
      const set = {};
      this.rows.forEach((r) => {
        ((r.data && r.data.Categories) || '').split(',').forEach((c) => { if (c.trim()) set[c.trim()] = true; });
      });
      return Object.keys(set).sort((a, b) => a.localeCompare(b, 'vi'));
    },
    filtered() {
      const q = this.q.toLowerCase();
      return this.list.filter((r) => {
        if (this.catFilter && r.top !== this.catFilter) return false;
        if (!q) return true;
        return r.sku.toLowerCase().indexOf(q) !== -1 || r.name.toLowerCase().indexOf(q) !== -1;
      });
    },
    hidden() { return this.list.filter((r) => !r.published).length; },
    pageCount() { return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE)); },
    pageRows() {
      const p = Math.min(this.page, this.pageCount);
      return this.filtered.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
    },
    safeSku() { return this.form ? safeSegment(this.form.sku) : ''; },
  },
  watch: {
    q() { this.page = 1; },
    catFilter() { this.page = 1; },
  },
  created() {
    this.reload();
  },
  methods: {
    onUploading(flag) {
      this.busyUploads = Math.max(0, this.busyUploads + (flag ? 1 : -1));
    },
    toast(title, type = 'ok', desc = '') {
      this.$store.dispatch('toast/push', { title, desc, type });
    },
    async reload() {
      this.loading = true;
      this.error = '';
      try {
        this.rows = (await sb.select('products', { authed: true })) || [];
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    // Cập nhật luôn dữ liệu đang hiển thị trên website (tab này)
    refreshSite() {
      this.$store.dispatch('products/fetchProducts');
    },
    formFrom(d) {
      return {
        sku: d.SKU || '',
        name: d.Name || '',
        categories: d.Categories || '',
        price: digits(d['Regular price']),
        salePrice: digits(d['Sale price']),
        warranty: digits(d['Warranty (months)']),
        inStock: String(d['In stock'] || 'Yes').toLowerCase() === 'no' ? 'No' : 'Yes',
        published: String(d.Published || 'Yes').toLowerCase() === 'no' ? 'No' : 'Yes',
        shortDesc: d['Short description'] || '',
        desc: d.Description || '',
        material: d.Material || '',
        delivery: d['Delivery time'] || '',
        length: d.Length || '',
        width: d.Width || '',
        height: d.Height || '',
        colors: d.Colors || '',
        images: (d.Images || '').split(',').map((s) => s.trim()).filter(Boolean).map((src) => ({ src })),
      };
    },
    openNew() {
      this.busyUploads = 0;
      this.isNew = true;
      this.editing = null;
      this.originalImages = [];
      this.formError = '';
      this.form = this.formFrom(blankData());
    },
    openEdit(r) {
      this.busyUploads = 0;
      this.isNew = false;
      this.editing = r.row;
      this.formError = '';
      this.form = this.formFrom({ ...blankData(), ...r.row.data, SKU: r.row.sku });
      this.originalImages = this.form.images.map((i) => i.src);
    },
    openDuplicate(r) {
      this.busyUploads = 0;
      this.isNew = true;
      this.editing = null;
      this.formError = '';
      const f = this.formFrom({ ...blankData(), ...r.row.data });
      f.sku = '';
      f.name = `${f.name} (bản sao)`;
      f.images = []; // ảnh không nhân bản để tránh xóa nhầm ảnh của sản phẩm gốc
      this.form = f;
      this.originalImages = [];
    },
    closeForm() {
      if (this.saving) return;
      this.form = null;
    },
    async save() {
      const f = this.form;
      this.formError = '';
      const sku = f.sku.trim();
      if (!sku) { this.formError = 'Vui lòng nhập mã sản phẩm (SKU).'; return; }
      if (!/^[A-Za-z0-9._-]+$/.test(sku)) { this.formError = 'Mã SKU chỉ gồm chữ không dấu, số, dấu . _ -'; return; }
      if (!f.name.trim()) { this.formError = 'Vui lòng nhập tên sản phẩm.'; return; }
      if (this.isNew && this.rows.some((r) => r.sku === sku)) { this.formError = 'Mã SKU này đã tồn tại.'; return; }
      const price = Number(digits(f.price)) || 0;
      const sale = Number(digits(f.salePrice)) || 0;
      if (sale && price && sale >= price) { this.formError = 'Giá khuyến mãi phải nhỏ hơn giá gốc.'; return; }

      const base = this.isNew ? blankData() : { ...blankData(), ...this.editing.data };
      const data = {
        ...base,
        SKU: sku,
        Name: f.name.trim(),
        Slug: base.Slug || toSlug(f.name),
        Categories: f.categories.trim(),
        'Regular price': price ? String(price) : '',
        'Sale price': sale ? String(sale) : '',
        'Warranty (months)': f.warranty,
        'In stock': f.inStock,
        Published: f.published,
        'Short description': f.shortDesc.trim(),
        Description: f.desc.trim(),
        Material: f.material,
        'Delivery time': f.delivery,
        Length: f.length,
        Width: f.width,
        Height: f.height,
        Colors: f.colors.trim(),
        Images: f.images.map((i) => i.src).join(', '),
      };
      let sortOrder = this.isNew ? 0 : this.editing.sort_order;
      if (this.isNew && this.rows.length) {
        sortOrder = Math.min(...this.rows.map((r) => r.sort_order || 0)) - 1; // sản phẩm mới lên đầu
      }
      this.saving = true;
      try {
        await sb.upsert('products', 'sku', [{
          sku, data, sort_order: sortOrder, updated_at: new Date().toISOString(),
        }]);
        const now = f.images.map((i) => i.src);
        await sb.removeFiles(this.originalImages.filter((u) => now.indexOf(u) === -1).map(sb.storagePathFromUrl));
        this.form = null;
        this.toast(this.isNew ? 'Đã thêm sản phẩm' : 'Đã lưu sản phẩm', 'ok', sku);
        await this.reload();
        this.refreshSite();
      } catch (e) {
        this.formError = e.message;
      } finally {
        this.saving = false;
      }
    },
    async togglePublished(r) {
      const next = r.published ? 'No' : 'Yes';
      try {
        await sb.upsert('products', 'sku', [{
          sku: r.sku, data: { ...r.row.data, Published: next }, sort_order: r.row.sort_order, updated_at: new Date().toISOString(),
        }]);
        await this.reload();
        this.refreshSite();
      } catch (e) {
        this.toast('Không cập nhật được', 'err', e.message);
      }
    },
    async remove(r) {
      if (!window.confirm(`Xóa sản phẩm ${r.sku} – ${r.name}?\nẢnh đã tải lên của sản phẩm này cũng sẽ bị xóa. Không hoàn tác được.`)) return;
      try {
        await sb.remove('products', 'sku', r.sku);
        const imgs = ((r.row.data && r.row.data.Images) || '').split(',').map((s) => s.trim());
        await sb.removeFiles(imgs.map(sb.storagePathFromUrl));
        this.toast('Đã xóa sản phẩm', 'ok', r.sku);
        await this.reload();
        this.refreshSite();
      } catch (e) {
        this.toast('Không xóa được', 'err', e.message);
      }
    },
  },
};
</script>
