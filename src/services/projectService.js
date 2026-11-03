import * as sb from '@/services/api';
import { projects as staticProjects, normalizeProject } from '@/content/projects';

/**
 * src/services/projectService.js
 * ------------------------------------------------------------------
 * Lấy danh sách dự án:
 *  - API trang quản trị hoạt động và đọc thành công -> dùng dữ liệu trong CSDL
 *    (do admin thêm/sửa/xóa ở /admin, cập nhật ngay không cần build lại)
 *  - Chưa cấu hình hoặc đọc lỗi -> dùng dữ liệu mẫu trong src/content/projects.js
 * ------------------------------------------------------------------
 */
export default {
  /** @returns {Promise<{items: object[], source: 'db'|'static'}>} */
  async fetchProjects() {
    if (sb.isConfigured()) {
      try {
        const rows = await sb.select('projects', { columns: 'slug,data,sort_order', order: 'sort_order.asc' });
        return {
          items: (rows || []).map((r) => normalizeProject({ ...(r.data || {}), slug: r.slug })),
          source: 'db',
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[HTM] Không đọc được dự án từ API, dùng dữ liệu mẫu:', err.message);
      }
    }
    return { items: staticProjects.map(normalizeProject), source: 'static' };
  },
};
