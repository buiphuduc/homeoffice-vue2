/**
 * src/utils/color.js — đổi TÊN MÀU tiếng Việt (cột "Colors" trong dữ liệu sản phẩm)
 * thành kiểu hiển thị của ô chọn màu ở trang chi tiết sản phẩm.
 *
 * THÊM MÀU MỚI: chỉ cần thêm 1 dòng vào COLOR_TABLE (tên không dấu "màu", viết thường).
 * Tên màu nào không có trong bảng sẽ được dò theo từ khóa dài nhất có trong tên
 * (vd "màu xanh rêu nhạt" -> dùng "xanh rêu"), cuối cùng mới dùng màu trung tính.
 */

const COLOR_TABLE = {
  // trắng / be / kem
  'trắng ngà': '#F1EADB',
  'trắng': '#F8F8F6',
  'kem': '#EFE6D2',
  'be': '#E3D9CB',
  // xám / đen
  'xám nhạt': '#C3C1BD',
  'xám đậm': '#4A4846',
  'xám ghi': '#8A8A8A',
  'xám': '#9A9A9A',
  'đen': '#1F1F1F',
  // xanh
  'xanh rêu đậm': '#4E6344',
  'xanh rêu': '#6F8260',
  'xanh navy': '#1F2F4F',
  'xanh dương đậm': '#1F3A6E',
  'xanh dương': '#3B6FB6',
  'xanh lá': '#5E8C5A',
  'xanh': '#5F8A8B',
  // màu nóng
  'cam đất': '#C4693F',
  'cam': '#E2823A',
  'đỏ': '#B83A32',
  'vàng': '#E2B84A',
  'hồng': '#E6B4B8',
  'nâu': '#6B4A32',
  // các loại gỗ (có thêm vân gỗ mờ khi hiển thị)
  'vân gỗ óc chó': '#6A4630',
  'vân gỗ tần bì': '#D5BE9A',
  'vân gỗ sồi sáng': '#E3CCA0',
  'vân gỗ sồi tự nhiên': '#C9A06B',
  'vân gỗ sồi': '#D2B48C',
  'vân gỗ teak': '#A8764A',
  'vân gỗ': '#B98B5E',
  'óc chó': '#6A4630',
  'tần bì': '#D5BE9A',
  'sồi': '#D2B48C',
  'teak': '#A8764A',
};

const FALLBACK = '#D9D6D0'; // màu trung tính khi không nhận ra tên màu
const KEYS_LONGEST_FIRST = Object.keys(COLOR_TABLE).sort((a, b) => b.length - a.length);

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/^màu\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Trả về mã màu (#RRGGBB) cho một tên màu. */
export function colorCode(name) {
  const n = normalize(name);
  if (!n) return FALLBACK;
  if (/^#[0-9a-f]{3,8}$/.test(n)) return n; // tên màu là mã hex
  if (COLOR_TABLE[n]) return COLOR_TABLE[n];
  const key = KEYS_LONGEST_FIRST.find((k) => n.indexOf(k) !== -1);
  return key ? COLOR_TABLE[key] : FALLBACK;
}

/**
 * Kiểu CSS cho ô chọn màu. Có ảnh mẫu (cột Colors dạng "Tên màu|URL ảnh") thì dùng ảnh;
 * màu "vân gỗ" được thêm vân mờ để khác với màu trơn.
 */
export function swatchStyle(name, image) {
  if (image) {
    return { backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  const style = { backgroundColor: colorCode(name) };
  if (/gỗ|sồi|óc chó|tần bì|teak/.test(normalize(name))) {
    style.backgroundImage = 'repeating-linear-gradient(100deg, rgba(255,255,255,.16) 0, rgba(255,255,255,.16) 2px, rgba(0,0,0,.07) 2px, rgba(0,0,0,.07) 5px)';
  }
  return style;
}
