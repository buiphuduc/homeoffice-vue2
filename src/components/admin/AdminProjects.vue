<template>
  <div>
    <div class="adm-bar">
      <span class="adm-hint adm-grow">{{ rows.length }} dự án</span>
      <button type="button" class="adm-btn adm-btn-primary" @click="openNew">+ Thêm dự án</button>
    </div>

    <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>
    <div class="adm-empty" v-if="loading">Đang tải...</div>
    <div class="adm-empty" v-else-if="!rows.length && !error">
      Chưa có dự án nào trong cơ sở dữ liệu. Bấm “+ Thêm dự án”, hoặc vào tab <b>Công cụ</b> để nhập 3 dự án mẫu.
    </div>

    <div class="adm-cards" v-else>
      <article class="adm-pcard" v-for="r in rows" :key="r.slug">
        <div class="adm-pcard-img">
          <img v-if="r.data.cover" :src="r.data.cover" alt="" loading="lazy" @error="$event.target.style.visibility = 'hidden'">
          <span class="adm-badge" v-if="r.data.featured">Tiêu biểu</span>
        </div>
        <div class="adm-pcard-body">
          <h3>{{ r.data.name || r.slug }}</h3>
          <p class="adm-muted">{{ [r.data.type, r.data.location].filter(Boolean).join(' · ') || 'Chưa có loại hình / địa điểm' }}</p>
          <p class="adm-muted">{{ countImages(r.data) }} ảnh · {{ (r.data.spaces || []).length }} không gian</p>
          <div class="adm-pcard-actions">
            <button type="button" class="adm-btn adm-btn-sm" @click="openEdit(r)">Sửa</button>
            <router-link class="adm-btn adm-btn-sm" :to="{ name: 'project-detail', params: { slug: r.slug } }" target="_blank">Xem trang</router-link>
            <button type="button" class="adm-btn adm-btn-sm adm-btn-danger" @click="remove(r)">Xóa</button>
          </div>
        </div>
      </article>
    </div>

    <!-- ===== Form thêm / sửa dự án ===== -->
    <admin-modal v-if="form" :title="isNew ? 'Thêm dự án' : 'Sửa dự án ' + form.name" wide @close="closeForm">
      <h3 class="adm-sec">1. Thông tin chung</h3>
      <div class="adm-grid-2">
        <label class="adm-field">
          <span>Tên dự án *</span>
          <input class="adm-input" v-model="form.name" placeholder="VD: KA-House" @input="autoSlug">
        </label>
        <label class="adm-field">
          <span>Đường dẫn (slug) *</span>
          <input class="adm-input" v-model.trim="form.slug" :disabled="!isNew" placeholder="ka-house">
          <small>{{ isNew ? 'Chỉ gồm chữ thường, số, dấu gạch ngang. Không đổi được sau khi tạo.' : 'Không đổi được sau khi tạo.' }}</small>
        </label>
      </div>
      <div class="adm-grid-2">
        <label class="adm-field">
          <span>Mô tả ngắn sau tên (hiện ở thẻ dự án)</span>
          <input class="adm-input" v-model="form.subtitle" placeholder="VD: Thiết kế &amp; thi công nội thất trọn gói">
        </label>
        <label class="adm-field">
          <span>Tiêu đề trang chi tiết</span>
          <input class="adm-input" v-model="form.title" placeholder="Để trống = tự tạo từ tên">
        </label>
      </div>
      <div class="adm-grid-3">
        <label class="adm-field">
          <span>Loại hình</span>
          <input class="adm-input" v-model="form.type" list="adm-type-list" placeholder="Nhà phố / Căn hộ / ...">
          <datalist id="adm-type-list"><option v-for="t in typeSuggestions" :key="t" :value="t"></option></datalist>
        </label>
        <label class="adm-field"><span>Địa điểm</span><input class="adm-input" v-model="form.location" placeholder="TP. Hồ Chí Minh"></label>
        <label class="adm-field"><span>Phong cách</span><input class="adm-input" v-model="form.style" placeholder="Hiện đại, tối giản"></label>
      </div>
      <div class="adm-grid-3">
        <label class="adm-field"><span>Diện tích (m²)</span><input class="adm-input" v-model="form.areaStr" inputmode="decimal"></label>
        <label class="adm-field"><span>Năm hoàn thành</span><input class="adm-input" v-model="form.yearStr" inputmode="numeric" placeholder="2026"></label>
        <label class="adm-field adm-check">
          <input type="checkbox" v-model="form.featured"> <span>Dự án tiêu biểu (hiện nhãn “Tiêu biểu”, ưu tiên ở trang chủ)</span>
        </label>
      </div>
      <label class="adm-field"><span>Hạng mục thi công</span><input class="adm-input" v-model="form.scope" placeholder="Nội thất phòng khách, bếp, phòng ngủ..."></label>
      <label class="adm-field"><span>Vật liệu</span><input class="adm-input" v-model="form.materials" placeholder="MDF phủ Melamine chống ẩm; MDF E1"></label>
      <label class="adm-field"><span>Mô tả ngắn 1–2 dòng (hiện ở “Dự án tương tự”)</span><textarea class="adm-input" rows="2" v-model="form.summary"></textarea></label>
      <label class="adm-field"><span>Mô tả cho Google (SEO, khoảng 150 ký tự)</span><textarea class="adm-input" rows="2" v-model="form.seoDescription"></textarea></label>

      <h3 class="adm-sec">2. Ảnh bìa</h3>
      <admin-image-list
        @uploading="onUploading"
        v-model="form.coverList" :max="1" :folder="'projects/' + form.slug" prefix="cover"
        :disabled="!form.slug" disabled-text="Hãy nhập tên dự án (để có slug) trước khi tải ảnh lên."
      ></admin-image-list>
      <div class="adm-grid-2">
        <label class="adm-field"><span>Mô tả ảnh bìa (alt)</span><input class="adm-input" v-model="form.coverAlt"></label>
        <label class="adm-field"><span>Chú thích dưới ảnh bìa</span><input class="adm-input" v-model="form.coverCaption"></label>
      </div>

      <h3 class="adm-sec">3. Câu chuyện dự án</h3>
      <label class="adm-field"><span>Tiêu đề câu chuyện</span><input class="adm-input" v-model="form.storyTitle" placeholder="Hơi thở tự nhiên trong từng nhịp sống"></label>
      <label class="adm-field">
        <span>Nội dung (cách nhau 1 dòng trống là sang đoạn mới)</span>
        <textarea class="adm-input" rows="6" v-model="form.storyText"></textarea>
      </label>
      <div class="adm-field">
        <span>Ảnh ngang rộng cuối phần câu chuyện</span>
        <admin-image-list
        @uploading="onUploading"
          v-model="form.storyImgList" :max="1" :folder="'projects/' + form.slug" prefix="story"
          :disabled="!form.slug" disabled-text="Hãy nhập tên dự án trước khi tải ảnh lên."
        ></admin-image-list>
      </div>

      <h3 class="adm-sec">4. Ảnh cạnh bảng thông tin (ví dụ mặt bằng)</h3>
      <admin-image-list
        @uploading="onUploading"
        v-model="form.planList" :max="1" :folder="'projects/' + form.slug" prefix="mat-bang"
        :disabled="!form.slug" disabled-text="Hãy nhập tên dự án trước khi tải ảnh lên."
      ></admin-image-list>
      <label class="adm-field"><span>Chú thích ảnh</span><input class="adm-input" v-model="form.planCaption" placeholder="Mặt bằng bố trí công năng tổng thể ..."></label>

      <h3 class="adm-sec">5. Sản phẩm HTM đã dùng trong dự án</h3>
      <label class="adm-field">
        <span>Mã sản phẩm, cách nhau dấu phẩy</span>
        <input class="adm-input" v-model="form.skusText" placeholder="BLV01, TGY02, KTV02">
      </label>
      <p class="adm-chips" v-if="skuChips.length">
        <span v-for="c in skuChips" :key="c.sku" class="adm-chip" :class="{ bad: !c.ok }">
          {{ c.sku }}<em v-if="!c.ok"> — không tìm thấy</em>
        </span>
      </p>

      <h3 class="adm-sec">6. Hình ảnh theo từng không gian</h3>
      <div class="adm-space" v-for="(sp, si) in form.spaces" :key="si">
        <div class="adm-space-head">
          <b>Không gian {{ si + 1 }}</b>
          <span class="adm-grow"></span>
          <button type="button" class="adm-icon" :disabled="si === 0" @click="moveSpace(si, -1)" title="Lên">&uarr;</button>
          <button type="button" class="adm-icon" :disabled="si === form.spaces.length - 1" @click="moveSpace(si, 1)" title="Xuống">&darr;</button>
          <button type="button" class="adm-icon adm-icon-danger" @click="removeSpace(si)" title="Xóa không gian">&times;</button>
        </div>
        <div class="adm-grid-3">
          <label class="adm-field">
            <span>Loại không gian</span>
            <select class="adm-input" v-model="sp.key">
              <option v-for="(label, key) in spaceOptions" :key="key" :value="key" :disabled="usedKey(key, si)">{{ label }}</option>
            </select>
          </label>
          <label class="adm-field"><span>Tên hiển thị riêng (tùy chọn)</span><input class="adm-input" v-model="sp.label" placeholder="VD: Phòng ngủ Master"></label>
          <label class="adm-field">
            <span>Bố cục ảnh</span>
            <select class="adm-input" v-model="sp.layout">
              <option value="">Tự động</option>
              <option value="feature">Ảnh đầu to + ảnh nhỏ</option>
              <option value="grid">Lưới 2 cột</option>
              <option value="split">Ảnh chính + 2 ảnh dọc</option>
            </select>
          </label>
        </div>
        <div class="adm-grid-2">
          <label class="adm-field"><span>Tính chất (VD: Hiện đại, Ấm cúng)</span><input class="adm-input" v-model="sp.mood"></label>
          <label class="adm-field"><span>Tông màu / điểm nhấn</span><input class="adm-input" v-model="sp.tone" placeholder="Tông gỗ sáng và trắng kem"></label>
        </div>
        <admin-image-list
        @uploading="onUploading"
          v-model="sp.images" with-caption :folder="'projects/' + form.slug" :prefix="sp.key || 'anh'"
          :disabled="!form.slug" disabled-text="Hãy nhập tên dự án trước khi tải ảnh lên."
        ></admin-image-list>
      </div>
      <button type="button" class="adm-btn" @click="addSpace" v-if="canAddSpace">+ Thêm không gian</button>

      <p class="adm-alert adm-alert-err" v-if="formError">{{ formError }}</p>
      <template slot="footer">
        <button type="button" class="adm-btn" @click="closeForm" :disabled="saving">Hủy</button>
        <button type="button" class="adm-btn adm-btn-primary" @click="save" :disabled="saving || busyUploads > 0">
          {{ saving ? 'Đang lưu...' : busyUploads > 0 ? 'Đang tải ảnh lên...' : 'Lưu dự án' }}
        </button>
      </template>
    </admin-modal>
  </div>
</template>

<script>
import * as sb from '@/services/api';
import AdminModal from '@/components/admin/AdminModal.vue';
import AdminImageList from '@/components/admin/AdminImageList.vue';
import { emptyProject, normalizeProject, projectSpaces } from '@/content/projects';
import { toSlug } from '@/utils/slug';

/** Gom mọi URL ảnh của 1 dự án (để biết ảnh nào bị bỏ đi khi lưu/xóa). */
function collectSrcs(p) {
  const list = [p.cover, p.storyImage, p.planImage];
  (p.spaces || []).forEach((sp) => (sp.images || []).forEach((im) => list.push(im.src)));
  return list.filter(Boolean);
}

export default {
  name: 'AdminProjects',
  components: { AdminModal, AdminImageList },
  data() {
    return {
      rows: [], loading: true, error: '',
      form: null, isNew: false, editing: null, originalSrcs: [], slugTouched: false,
      saving: false, formError: '', busyUploads: 0,
    };
  },
  computed: {
    spaceOptions() { return projectSpaces; },
    typeSuggestions() {
      const set = {};
      this.rows.forEach((r) => { if (r.data && r.data.type) set[r.data.type] = true; });
      return Object.keys(set);
    },
    canAddSpace() {
      return this.form && this.form.spaces.length < Object.keys(projectSpaces).length;
    },
    skuChips() {
      if (!this.form) return [];
      const known = {};
      (this.$store.state.products.items || []).forEach((p) => { known[p.sku] = true; });
      return this.form.skusText.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean)
        .map((sku) => ({ sku, ok: !!known[sku] }));
    },
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
    countImages(d) {
      return collectSrcs(d || {}).length - ['cover', 'storyImage', 'planImage'].filter((k) => d && d[k]).length;
    },
    async reload() {
      this.loading = true;
      this.error = '';
      try {
        this.rows = (await sb.select('projects', { authed: true })) || [];
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    refreshSite() {
      this.$store.dispatch('projects/fetch', { force: true });
    },
    toForm(p) {
      return {
        slug: p.slug, name: p.name, subtitle: p.subtitle, title: p.title, type: p.type, location: p.location,
        areaStr: p.area ? String(p.area) : '', yearStr: p.year ? String(p.year) : '',
        style: p.style, scope: p.scope, materials: p.materials, featured: !!p.featured,
        summary: p.summary, seoDescription: p.seoDescription,
        coverList: p.cover ? [{ src: p.cover }] : [], coverAlt: p.coverAlt, coverCaption: p.coverCaption,
        storyTitle: p.storyTitle, storyText: (p.story || []).join('\n\n'),
        storyImgList: p.storyImage ? [{ src: p.storyImage }] : [],
        planList: p.planImage ? [{ src: p.planImage }] : [], planCaption: p.planCaption,
        skusText: (p.skus || []).join(', '),
        spaces: (p.spaces || []).map((sp) => ({
          key: sp.key, label: sp.label || '', layout: sp.layout || '', mood: sp.mood || '', tone: sp.tone || '',
          images: (sp.images || []).map((im) => ({ src: im.src, caption: im.caption || '', alt: im.alt || '' })),
        })),
      };
    },
    openNew() {
      this.busyUploads = 0;
      this.isNew = true;
      this.editing = null;
      this.originalSrcs = [];
      this.slugTouched = false;
      this.formError = '';
      this.form = this.toForm(emptyProject());
    },
    openEdit(r) {
      this.busyUploads = 0;
      this.isNew = false;
      this.editing = r;
      this.formError = '';
      const p = normalizeProject({ ...r.data, slug: r.slug });
      this.form = this.toForm(p);
      this.originalSrcs = collectSrcs(p);
    },
    closeForm() {
      if (this.saving) return;
      this.form = null;
    },
    autoSlug() {
      if (this.isNew && !this.slugTouched) this.form.slug = toSlug(this.form.name);
    },
    usedKey(key, idx) {
      return this.form.spaces.some((s, i) => i !== idx && s.key === key);
    },
    addSpace() {
      const key = Object.keys(projectSpaces).find((k) => !this.usedKey(k, -1));
      if (key) {
        this.form.spaces.push({
          key, label: '', layout: '', mood: '', tone: '', images: [],
        });
      }
    },
    removeSpace(i) {
      const sp = this.form.spaces[i];
      if (sp.images.length && !window.confirm('Xóa không gian này và toàn bộ ảnh trong đó?')) return;
      this.form.spaces.splice(i, 1);
    },
    moveSpace(i, d) {
      const j = i + d;
      if (j < 0 || j >= this.form.spaces.length) return;
      const arr = this.form.spaces;
      const tmp = arr[i];
      this.$set(arr, i, arr[j]);
      this.$set(arr, j, tmp);
    },
    buildProject() {
      const f = this.form;
      const name = f.name.trim();
      const cap = (txt) => (txt || '').trim();
      const spaces = f.spaces.map((sp) => {
        const label = cap(sp.label) || projectSpaces[sp.key] || '';
        return {
          key: sp.key,
          label: cap(sp.label),
          layout: sp.layout,
          mood: cap(sp.mood),
          tone: cap(sp.tone),
          images: sp.images.map((im, n) => ({
            src: im.src,
            caption: cap(im.caption),
            alt: im.alt || `${label} – ${name} (${cap(im.caption) || n + 1})`,
          })),
        };
      });
      return {
        name,
        subtitle: cap(f.subtitle),
        title: cap(f.title) || `Thiết kế & thi công nội thất – ${name}`,
        type: cap(f.type),
        location: cap(f.location),
        area: parseFloat(String(f.areaStr).replace(',', '.')) || null,
        year: parseInt(f.yearStr, 10) || null,
        style: cap(f.style),
        scope: cap(f.scope),
        materials: cap(f.materials),
        featured: !!f.featured,
        cover: f.coverList[0] ? f.coverList[0].src : '',
        coverAlt: cap(f.coverAlt) || `Hình ảnh dự án ${name}`,
        coverCaption: cap(f.coverCaption),
        summary: cap(f.summary),
        seoDescription: cap(f.seoDescription)
          || `${name} — dự án nội thất do HTM Design & Build thiết kế và thi công. Xem hình ảnh dự án theo từng không gian.`,
        storyTitle: cap(f.storyTitle),
        story: f.storyText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
        storyImage: f.storyImgList[0] ? f.storyImgList[0].src : '',
        planImage: f.planList[0] ? f.planList[0].src : '',
        planCaption: cap(f.planCaption),
        skus: f.skusText.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean),
        spaces,
      };
    },
    async save() {
      const f = this.form;
      this.formError = '';
      if (!f.name.trim()) { this.formError = 'Vui lòng nhập tên dự án.'; return; }
      const slug = f.slug.trim();
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) { this.formError = 'Slug chỉ gồm chữ thường không dấu, số, dấu gạch ngang (VD: ka-house).'; return; }
      if (this.isNew && this.rows.some((r) => r.slug === slug)) { this.formError = 'Slug này đã có dự án khác dùng.'; return; }
      const data = this.buildProject();
      let sortOrder = this.isNew ? 0 : this.editing.sort_order;
      if (this.isNew && this.rows.length) sortOrder = Math.min(...this.rows.map((r) => r.sort_order || 0)) - 1; // dự án mới lên đầu
      this.saving = true;
      try {
        await sb.upsert('projects', 'slug', [{
          slug, data, sort_order: sortOrder, updated_at: new Date().toISOString(),
        }]);
        const now = collectSrcs(data);
        await sb.removeFiles(this.originalSrcs.filter((u) => now.indexOf(u) === -1).map(sb.storagePathFromUrl));
        const wasNew = this.isNew;
        this.form = null;
        this.toast(wasNew ? 'Đã thêm dự án' : 'Đã lưu dự án', 'ok', data.name);
        await this.reload();
        this.refreshSite();
      } catch (e) {
        this.formError = e.message;
      } finally {
        this.saving = false;
      }
    },
    async remove(r) {
      if (!window.confirm(`Xóa dự án "${r.data.name || r.slug}"?\nẢnh đã tải lên của dự án cũng sẽ bị xóa. Không hoàn tác được.`)) return;
      try {
        await sb.remove('projects', 'slug', r.slug);
        await sb.removeFiles(collectSrcs(normalizeProject({ ...r.data, slug: r.slug })).map(sb.storagePathFromUrl));
        this.toast('Đã xóa dự án', 'ok', r.data.name || r.slug);
        await this.reload();
        this.refreshSite();
      } catch (e) {
        this.toast('Không xóa được', 'err', e.message);
      }
    },
  },
};
</script>
