import config from '@/config';

/** Shared metadata for client navigation and build-time HTML. */
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
  title, description, image, path, noindex = false,
} = {}) {
  const fullTitle = title ? `${title} - ${config.shopName}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const img = new URL(image || DEFAULT_IMAGE, `${config.siteUrl}/`).href;
  const canonical = new URL(path || '/', `${config.siteUrl}/`);
  canonical.hash = '';
  while (canonical.pathname.length > 1 && canonical.pathname.endsWith('/')) canonical.pathname = canonical.pathname.slice(0, -1);
  [...canonical.searchParams.keys()].forEach((key) => {
    if (/^utm_/i.test(key) || ['gclid', 'fbclid', 'msclkid'].includes(key.toLowerCase())) canonical.searchParams.delete(key);
  });
  const utilityPrefixes = ['/gio-hang', '/thanh-toan', '/dat-hang-thanh-cong', '/yeu-thich', '/tim-kiem'];
  const utilityPage = utilityPrefixes.some((prefix) => canonical.pathname === prefix || canonical.pathname.startsWith(`${prefix}/`));
  const internalSearch = canonical.pathname.startsWith('/danh-muc') && canonical.searchParams.has('q');
  upsertMeta('name', 'robots', noindex || utilityPage || internalSearch ? 'noindex, follow' : 'index, follow');
  const url = canonical.href;

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
