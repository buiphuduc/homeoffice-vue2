import { projects, projectSpaces } from '@/content/projects';

/**
 * src/utils/projects.js
 * Hàm hỗ trợ cho mục Dự án (lọc, tìm, đếm ảnh, dự án liên quan...).
 */

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function spaceLabel(key) {
  return projectSpaces[key] || key;
}

/** Tên đầy đủ ở thẻ: "KA-House - Thiết kế & thi công nội thất trọn gói". */
export function cardTitle(p) {
  return p.subtitle ? `${p.name} - ${p.subtitle}` : p.name;
}

/** Dòng nhỏ trên thẻ: "Nhà phố · TP. Hồ Chí Minh" (bỏ phần thiếu). */
export function projectKicker(p) {
  return [p.type, p.location].filter(Boolean).join(' · ');
}

export function countSpaceImages(space) {
  return (space.images || []).length;
}

export function countImages(project) {
  return (project.spaces || []).reduce((sum, s) => sum + countSpaceImages(s), 0);
}

/** Các không gian có ảnh, kèm nhãn, số ảnh và số thứ tự để hiển thị. */
export function getSpaceList(project) {
  const list = (project.spaces || []).filter((s) => countSpaceImages(s) > 0);
  return list.map((s, i) => ({
    ...s,
    label: s.label || spaceLabel(s.key),
    count: countSpaceImages(s),
    index: i + 1,
    total: list.length,
  }));
}

/** Danh sách loại hình duy nhất (dùng sinh chip lọc). */
export function projectTypes() {
  const set = [];
  projects.forEach((p) => { if (p.type && set.indexOf(p.type) === -1) set.push(p.type); });
  return set;
}

/** Lọc theo loại hình + từ khóa (tên, địa điểm, loại hình, phong cách). */
export function filterProjects({ type = '', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return projects.filter((p) => {
    if (type && p.type !== type) return false;
    if (!q) return true;
    return [p.name, p.subtitle, p.title, p.location, p.type, p.style]
      .filter(Boolean)
      .some((t) => t.toLowerCase().indexOf(q) !== -1);
  });
}

/** Dự án liên quan: ưu tiên cùng loại hình, bỏ chính nó, lấy tối đa n. */
export function getRelatedProjects(project, n = 3) {
  const others = projects.filter((p) => p.slug !== project.slug);
  const same = others.filter((p) => p.type && p.type === project.type);
  const rest = others.filter((p) => !(p.type && p.type === project.type));
  return same.concat(rest).slice(0, n);
}

/** Meta ngắn gọn cho thẻ: "120 m² · 2026" (bỏ phần nào thiếu). */
export function projectMeta(p) {
  const parts = [];
  if (p.area) parts.push(`${p.area} m²`);
  if (p.year) parts.push(String(p.year));
  return parts.join(' · ');
}
