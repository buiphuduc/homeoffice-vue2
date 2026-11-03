/**
 * src/utils/image.js — chuẩn bị ảnh trước khi tải lên kho ảnh:
 * thu nhỏ cạnh dài tối đa 1920px và nén JPEG để website tải nhanh.
 * GIF/SVG hoặc khi trình duyệt không hỗ trợ thì giữ nguyên file gốc.
 */

const EXT_BY_TYPE = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg',
};

function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') return createImageBitmap(file);
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

/**
 * @returns {Promise<{blob: Blob, ext: string, contentType: string}>}
 */
export async function prepareImage(file, { maxSize = 1920, quality = 0.86 } = {}) {
  const original = {
    blob: file,
    ext: EXT_BY_TYPE[file.type] || 'jpg',
    contentType: file.type || 'image/jpeg',
  };
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return original;
  try {
    const bmp = await loadBitmap(file);
    const w = bmp.width || bmp.naturalWidth;
    const h = bmp.height || bmp.naturalHeight;
    if (!w || !h) return original;
    const scale = Math.min(1, maxSize / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return original;
    ctx.fillStyle = '#ffffff'; // ảnh PNG nền trong suốt -> nền trắng khi chuyển JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) return original;
    // Nếu nén xong còn lớn hơn file gốc (ảnh vốn đã nhỏ) thì giữ file gốc
    if (scale === 1 && blob.size >= file.size && file.type === 'image/jpeg') return original;
    return { blob, ext: 'jpg', contentType: 'image/jpeg' };
  } catch (e) {
    return original;
  }
}

/** Tên file duy nhất: <tiền-tố>-<mã ngẫu nhiên>.<đuôi> */
export function makeFileName(prefix, ext) {
  const rand = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  return `${prefix}-${rand}.${ext}`;
}
