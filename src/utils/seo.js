import config from '@/config';

/**
 * src/utils/seo.js
 * ------------------------------------------------------------------
 * Cập nhật <title>, <meta name="description">, Open Graph, Twitter Card
 * và <link rel="canonical"> mỗi khi đổi route — vì app KHÔNG có
 * server-side rendering (đây là SPA build tĩnh bằng Vue CLI), việc này
 * chỉ chỉnh được DOM sau khi JavaScript đã chạy.
 *
 * -> Google (Googlebot render JS) và tab trình duyệt sẽ thấy đúng tiêu
 *    đề/mô tả riêng cho từng trang/sản phẩm/bài viết.
 * -> Facebook/Zalo/Messenger khi dán link KHÔNG chạy JavaScript lúc lấy
 *    preview, nên chúng sẽ luôn hiển thị đúng bộ thẻ TĨNH khai báo sẵn
 *    trong public/index.html (áp dụng cho MỌI URL, kể cả link sản phẩm)
 *    — đây là giới hạn cố hữu của SPA thuần, chỉ khắc phục triệt để
 *    bằng cách thêm prerender/SSR (vd Nuxt, hoặc dịch vụ prerender.io).
 *    Ghi chú này để không ai hiểu nhầm là "share Facebook đã ra ảnh
 *    sản phẩm" khi chưa thực sự đúng.
 * ------------------------------------------------------------------
 */

const DEFAULT_TITLE = `${config.shopName} - Nội Thất Phong Cách Scandinavian`;
const DEFAULT_DESCRIPTION = `${config.shopName} — nội thất phong cách Scandinavian tối giản: bàn ghế sofa, tủ kệ, phòng khách, phòng ngủ, bếp & phòng ăn, nội thất văn phòng. Giao hàng toàn quốc, bảo hành dài hạn.`;
const DEFAULT_IMAGE = `${config.siteUrl}/images/banners/hero-banner.jpg`;

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Gọi ở mỗi trang (thường trong `created()` hoặc 1 `watch` khi dữ liệu
 * trang đổi, ví dụ đổi sản phẩm) để cập nhật SEO cho đúng nội dung
 * trang đó.
 * @param {object} opts
 * @param {string} [opts.title] - Không kèm tên shop, hàm tự nối thêm.
 * @param {string} [opts.description]
 * @param {string} [opts.image] - URL tuyệt đối, mặc định ảnh banner chung.
 * @param {string} [opts.path] - Đường dẫn (vd '/san-pham/ABC') để tạo canonical URL tuyệt đối.
 */
export function setPageMeta({
  title, description, image, path,
} = {}) {
  const fullTitle = title ? `${title} - ${config.shopName}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const img = image || DEFAULT_IMAGE;
  const url = path ? `${config.siteUrl}${path}` : (typeof window !== 'undefined' ? window.location.href : config.siteUrl);

  document.title = fullTitle;

  upsertMeta('name', 'description', desc);
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:description', desc);
  upsertMeta('property', 'og:image', img);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', title ? 'article' : 'website');
  upsertMeta('name', 'twitter:title', fullTitle);
  upsertMeta('name', 'twitter:description', desc);
  upsertMeta('name', 'twitter:image', img);

  upsertCanonical(url);
}

export default { setPageMeta };
