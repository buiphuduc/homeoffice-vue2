/**
 * src/utils/slug.js — tạo slug/tên file an toàn từ tiếng Việt.
 */

/** "Căn hộ Thủ Đức" -> "can-ho-thu-duc" */
export function toSlug(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Chỉ giữ chữ, số, gạch ngang/dưới — dùng làm tên thư mục trên kho ảnh. */
export function safeSegment(str) {
  return String(str || '').trim().replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}
