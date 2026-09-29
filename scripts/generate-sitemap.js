#!/usr/bin/env node
/**
 * scripts/generate-sitemap.js
 * ------------------------------------------------------------------
 * Sinh file public/sitemap.xml gồm:
 *  - Các trang tĩnh (trang chủ, danh mục, giới thiệu, liên hệ...)
 *  - Toàn bộ URL sản phẩm THẬT lấy trực tiếp từ public/data/products.csv
 *    (chỉ lấy sản phẩm có Published=Yes) — vì file này đổi thường xuyên
 *    khi cập nhật dữ liệu, sitemap KHÔNG được build tự động lúc
 *    `npm run build` để tránh sinh URL lệch lúc đang test data; hãy
 *    chạy tay bằng:
 *
 *      node scripts/generate-sitemap.js
 *
 *    ...sau khi dữ liệu sản phẩm đã ổn định, hoặc thêm vào bước deploy
 *    CI/CD của bạn nếu muốn tự động hoá.
 *  - Danh sách slug bài viết Cảm hứng sáng tạo + trang pháp lý được
 *    khai báo tay ở dưới (SLUG rất ít khi đổi) — nếu thêm bài viết/
 *    trang pháp lý mới trong src/content/*.js, nhớ thêm slug tương ứng
 *    vào đây để sitemap đầy đủ.
 * ------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const SITE_URL = (process.env.VUE_APP_SITE_URL || 'https://htmvn.com').replace(/\/$/, '');
const CSV_PATH = path.join(__dirname, '..', 'public', 'data', 'products.csv');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Giữ đồng bộ tay với slug thật trong src/content/inspirationArticles.js
const INSPIRATION_SLUGS = [
  'anh-sang-bac-au',
  've-dep-go-soi',
  'mau-trung-tinh-phong-ngu',
  'phoi-vai-khong-gian-nho',
  'bep-toi-gian-cong-nang',
  'ban-ben-sofa-dang-tron',
  'goc-doc-sach-hoan-hao',
  'xu-huong-biophilic-design',
];

// Giữ đồng bộ tay với slug thật trong src/content/legalPages.js
const LEGAL_SLUGS = ['doi-tra', 'bao-mat', 'dieu-khoan', 'van-chuyen', 'bao-hanh'];

const STATIC_PATHS = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/danh-muc', changefreq: 'daily', priority: '0.9' },
  { path: '/gioi-thieu', changefreq: 'monthly', priority: '0.6' },
  { path: '/lien-he', changefreq: 'monthly', priority: '0.5' },
  { path: '/cam-hung-sang-tao', changefreq: 'weekly', priority: '0.7' },
];

function xmlEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(loc, opts) {
  const changefreq = (opts && opts.changefreq) || 'monthly';
  const priority = (opts && opts.priority) || '0.5';
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function main() {
  const entries = [];

  STATIC_PATHS.forEach((s) => {
    entries.push(urlEntry(`${SITE_URL}${s.path}`, { changefreq: s.changefreq, priority: s.priority }));
  });

  INSPIRATION_SLUGS.forEach((slug) => {
    entries.push(urlEntry(`${SITE_URL}/cam-hung-sang-tao/${slug}`, { changefreq: 'monthly', priority: '0.6' }));
  });

  LEGAL_SLUGS.forEach((slug) => {
    entries.push(urlEntry(`${SITE_URL}/chinh-sach/${slug}`, { changefreq: 'yearly', priority: '0.3' }));
  });

  if (fs.existsSync(CSV_PATH)) {
    const csv = fs.readFileSync(CSV_PATH, 'utf8');
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
    let productCount = 0;
    parsed.data.forEach((row) => {
      const published = String(row.Published || 'Yes').trim().toLowerCase();
      const sku = (row.SKU || '').trim();
      if (!sku || published === 'no' || published === '0' || published === 'false') return;
      entries.push(urlEntry(`${SITE_URL}/san-pham/${encodeURIComponent(sku)}`, { changefreq: 'weekly', priority: '0.7' }));
      productCount += 1;
    });
    console.log(`Đã thêm ${productCount} URL sản phẩm từ products.csv`);
  } else {
    console.warn(`Không tìm thấy ${CSV_PATH} — bỏ qua URL sản phẩm.`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`Đã ghi ${entries.length} URL vào ${OUTPUT_PATH}`);
}

main();
