const fs = require('fs');
const path = require('path');

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// Paths are produced by the same Vue store and content modules that render pages.
function generateSitemap(directory, siteUrl, paths) {
  const urls = [...new Set(paths)].map((route) => new URL(route, `${siteUrl}/`).href);
  const entries = urls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n');
  fs.writeFileSync(path.join(directory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
  fs.writeFileSync(path.join(directory, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}
module.exports = { generateSitemap };
if (require.main === module) {
  console.error('Use npm run build (or npm run sitemap) to regenerate HTML and sitemap from the same catalog.');
  process.exitCode = 1;
}
