<template>
  <div class="adm-imgs">
    <p class="adm-hint adm-warn" v-if="disabled">{{ disabledText }}</p>
    <div class="adm-imgs-grid">
      <div class="adm-img" v-for="(it, i) in value" :key="it.src">
        <div class="adm-img-thumb">
          <img :src="it.src" alt="" @error="$event.target.style.opacity = .25">
          <span class="adm-img-badge" v-if="i === 0 && max !== 1 && value.length > 1">Ảnh chính</span>
        </div>
        <input
          v-if="withCaption"
          class="adm-input adm-input-sm"
          :value="it.caption"
          placeholder="Chú thích (không bắt buộc)"
          @input="setCaption(i, $event.target.value)"
        >
        <div class="adm-img-actions">
          <button type="button" class="adm-icon" title="Chuyển lên đầu / sang trái" :disabled="i === 0" @click="move(i, -1)">&larr;</button>
          <button type="button" class="adm-icon" title="Chuyển sang phải" :disabled="i === value.length - 1" @click="move(i, 1)">&rarr;</button>
          <button type="button" class="adm-icon adm-icon-danger" title="Xóa ảnh này" @click="removeAt(i)">&times;</button>
        </div>
      </div>

      <label
        class="adm-img-add"
        :class="{ 'is-disabled': disabled || uploading, 'is-over': over }"
        @dragover.prevent="over = true"
        @dragleave.prevent="over = false"
        @drop.prevent="onDrop"
      >
        <input type="file" accept="image/*" :multiple="max !== 1" :disabled="disabled || uploading" @change="onPick">
        <span class="adm-img-plus">+</span>
        <span>{{ uploading ? `Đang tải ${done}/${total}...` : (max === 1 ? 'Chọn / kéo ảnh vào đây' : 'Tải ảnh lên') }}</span>
      </label>
    </div>

    <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>

    <div class="adm-imgs-url" v-if="!disabled">
      <input
        class="adm-input adm-input-sm"
        v-model.trim="urlInput"
        placeholder="Hoặc dán đường dẫn ảnh (https://… hoặc /images/…)"
        @keydown.enter.prevent="addUrl"
      >
      <button type="button" class="adm-btn adm-btn-sm" @click="addUrl">Thêm</button>
    </div>
  </div>
</template>

<script>
import * as sb from '@/services/api';
import { prepareImage, makeFileName } from '@/utils/image';

const MAX_BYTES = 20 * 1024 * 1024;

/**
 * Danh sách ảnh có tải lên (kéo thả được), đổi thứ tự, xóa, chú thích.
 * v-model: mảng [{ src, caption? }]. Ảnh được thu nhỏ/nén rồi tải lên kho ảnh
 * trên hosting (thư mục /uploads/`folder`). max=1 -> chỉ 1 ảnh (ảnh mới thay ảnh cũ).
 */
export default {
  name: 'AdminImageList',
  props: {
    value: { type: Array, default: () => [] },
    folder: { type: String, default: '' }, // vd: products/BLV01
    prefix: { type: String, default: 'img' }, // tiền tố tên file
    max: { type: Number, default: 0 }, // 0 = không giới hạn
    withCaption: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledText: { type: String, default: 'Hãy nhập mã/tên trước khi tải ảnh lên.' },
  },
  data() {
    return {
      uploading: false, done: 0, total: 0, error: '', urlInput: '', over: false,
    };
  },
  beforeDestroy() {
    if (this.uploading) this.$emit('uploading', false);
  },
  methods: {
    emit(list) { this.$emit('input', list); },
    setCaption(i, v) {
      this.emit(this.value.map((x, k) => (k === i ? { ...x, caption: v } : x)));
    },
    move(i, d) {
      const list = this.value.slice();
      const j = i + d;
      if (j < 0 || j >= list.length) return;
      const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
      this.emit(list);
    },
    removeAt(i) {
      this.emit(this.value.filter((x, k) => k !== i));
    },
    addUrl() {
      const u = this.urlInput;
      if (!u) return;
      if (!/^(https?:\/\/|\/)/.test(u)) { this.error = 'Đường dẫn phải bắt đầu bằng https:// hoặc /'; return; }
      this.error = '';
      const item = { src: u, caption: '' };
      this.emit(this.max === 1 ? [item] : this.value.concat([item]));
      this.urlInput = '';
    },
    onPick(e) {
      const files = Array.from(e.target.files || []);
      e.target.value = '';
      this.upload(files);
    },
    onDrop(e) {
      this.over = false;
      this.upload(Array.from((e.dataTransfer && e.dataTransfer.files) || []));
    },
    async upload(files) {
      if (this.disabled || !files.length) return;
      this.error = '';
      let list = files.filter((f) => /^image\//.test(f.type));
      if (list.length !== files.length) this.error = 'Một số file không phải ảnh nên đã bị bỏ qua.';
      if (this.max === 1) list = list.slice(0, 1);
      if (!list.length) return;
      this.uploading = true; this.done = 0; this.total = list.length;
      this.$emit('uploading', true);
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        try {
          if (file.size > MAX_BYTES) throw new Error(`"${file.name}" lớn hơn 20 MB.`);
          const { blob, ext, contentType } = await prepareImage(file); // eslint-disable-line no-await-in-loop
          const name = makeFileName(this.prefix, ext);
          const url = await sb.uploadFile(`${this.folder}/${name}`, blob, contentType); // eslint-disable-line no-await-in-loop
          const item = { src: url, caption: '' };
          // Luôn nối vào danh sách MỚI NHẤT (người dùng có thể đã gõ chú thích / đổi chỗ / xóa ảnh trong lúc đang tải)
          this.emit(this.max === 1 ? [item] : this.value.concat([item]));
        } catch (err) {
          this.error = err.message || 'Tải ảnh lên không thành công.';
        }
        this.done += 1;
      }
      this.uploading = false;
      this.$emit('uploading', false);
    },
  },
};
</script>
