import axios from 'axios';
import Papa from 'papaparse';
import config from '@/config';
import { parseVNDNumber } from '@/utils/format';

/**
 * src/services/sheetService.js
 * ------------------------------------------------------------------
 * Chịu trách nhiệm DUY NHẤT: lấy dữ liệu sản phẩm từ Google Sheet (CSV)
 * và chuẩn hoá thành mảng object sản phẩm mà toàn bộ app dùng chung.
 *
 * Tách riêng thành "service" (thay vì gọi axios thẳng trong component)
 * để: nếu sau này bạn đổi nguồn dữ liệu (vd chuyển sang API thật, hoặc
 * Airtable, hoặc file JSON tĩnh), CHỈ CẦN SỬA FILE NÀY — không phải sửa
 * từng component đang hiển thị sản phẩm.
 * ------------------------------------------------------------------
 */

/**
 * Cột CSV kỳ vọng (đúng theo file Excel mẫu du-lieu-mau-san-pham.xlsx):
 * SKU, Name, Categories, Regular price, Sale price, Images,
 * Short description, Description, In stock?, Published, Colors
 *
 * Cột "Colors" là TÙY CHỌN — dùng khi sản phẩm có nhiều màu/kiểu gỗ để
 * khách chọn (giống dropdown "Màu gỗ" ở trang chi tiết sản phẩm).
 * Định dạng: mỗi màu cách nhau bởi dấu ";", trong 1 màu thì "Tên màu|URL ảnh mẫu".
 * Ví dụ: "Tự Nhiên|https://.../go-tu-nhien.jpg; Nâu Đỏ|https://.../nau-do.jpg"
 * Nếu chỉ cần tên màu, không cần ảnh mẫu, có thể bỏ trống phần sau dấu "|".
 */
function parseColors(raw) {
  if (!raw) return [];
  return raw
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, image] = entry.split('|').map((s) => (s || '').trim());
      return { name: name || entry, image: image || '' };
    });
}

function mapCsvRowToProduct(row, index) {
  const price = parseVNDNumber(row['Regular price']);
  const sale = parseVNDNumber(row['Sale price']);
  const categoriesRaw = (row['Categories'] || '').trim();

  // Hỗ trợ nhiều danh mục cách nhau bởi dấu phẩy, mỗi danh mục phân cấp bởi ' > '
  const categoryPaths = categoriesRaw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.split('>').map((s) => s.trim()).filter(Boolean));

  const images = (row['Images'] || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const effectiveSale = sale > 0 && sale < price ? sale : null;

  return {
    id: row['SKU'] ? row['SKU'].trim() : `sp-${index}`,
    sku: (row['SKU'] || '').trim(),
    name: (row['Name'] || '').trim(),
    categoryPaths: categoryPaths.length ? categoryPaths : [['Chưa phân loại']],
    price,
    salePrice: effectiveSale,
    effectivePrice: effectiveSale || price,
    images,
    colors: parseColors(row['Colors']),
    shortDesc: (row['Short description'] || '').trim(),
    desc: (row['Description'] || '').trim(),
    inStock: (row['In stock?'] || 'instock').trim().toLowerCase() !== 'outofstock',
    published: String(row['Published']) !== '0',
  };
}

export default {
  /**
   * Tải toàn bộ sản phẩm từ Google Sheet CSV đã publish.
   * @returns {Promise<object[]>}
   * @throws sẽ ném lỗi nếu URL chưa cấu hình hoặc fetch thất bại — component
   * gọi hàm này cần tự bắt lỗi (try/catch hoặc .catch()) để hiển thị thông
   * báo phù hợp, KHÔNG để lỗi rơi tự do làm vỡ giao diện.
   */
  async fetchProducts() {
    if (!config.sheetCsvUrl) {
      throw new Error('Chưa cấu hình VUE_APP_SHEET_CSV_URL trong file .env');
    }

    const res = await axios.get(config.sheetCsvUrl);
    const parsed = Papa.parse(res.data, { header: true, skipEmptyLines: true });

    return parsed.data
      .map(mapCsvRowToProduct)
      .filter((p) => p.name); // bỏ dòng trống/lỗi định dạng trong Sheet
  },
};
