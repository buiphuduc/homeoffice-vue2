/**
 * src/utils/category.js
 * ------------------------------------------------------------------
 * Toàn bộ logic xử lý "cây danh mục" (danh mục cha > con > cháu) nằm
 * ở đây. Danh mục KHÔNG được khai báo cứng trong code — mà được suy
 * ra tự động từ cột "Categories" trong dữ liệu sản phẩm (Google Sheet).
 * Nghĩa là bạn thêm 1 danh mục hoàn toàn mới trong Sheet, app tự nhận
 * diện, không cần sửa file nào trong dự án.
 * ------------------------------------------------------------------
 */

/**
 * Kiểm tra 1 sản phẩm có thuộc đường dẫn danh mục (catPath) hay không.
 * @param {object} product - sản phẩm đã chuẩn hoá, có product.categoryPaths (mảng các mảng)
 * @param {string[]} catPath - ví dụ ['Phòng Khách', 'Bàn Sofa']
 * @returns {boolean}
 */
export function productMatchesCategoryPath(product, catPath) {
  if (!catPath || !catPath.length) return true; // không lọc -> luôn khớp
  return product.categoryPaths.some((path) => {
    if (path.length < catPath.length) return false;
    for (let i = 0; i < catPath.length; i++) {
      if (path[i] !== catPath[i]) return false;
    }
    return true;
  });
}

/**
 * Lấy danh sách danh mục CON trực tiếp của 1 đường dẫn cha, từ toàn bộ sản phẩm.
 * @param {object[]} products
 * @param {string[]} parentPath - mảng rỗng = lấy danh mục cấp 1 (top-level)
 * @returns {string[]} đã sắp xếp A-Z
 */
export function getChildCategories(products, parentPath) {
  const set = new Set();
  products.forEach((p) => {
    p.categoryPaths.forEach((path) => {
      if (path.length <= parentPath.length) return;
      for (let i = 0; i < parentPath.length; i++) {
        if (path[i] !== parentPath[i]) return;
      }
      set.add(path[parentPath.length]);
    });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
}

/**
 * Gom danh mục CẤP 2 (con của danh mục cấp 1) từ toàn bộ sản phẩm, kèm
 * theo 1 ảnh đại diện (lấy ảnh đầu tiên tìm thấy của sản phẩm thuộc
 * danh mục đó) — dùng để hiển thị khối "Danh mục nổi bật" có ảnh thật
 * trên trang chủ, giống cách site gốc trình bày.
 * @param {object[]} products
 * @param {number} limit - giới hạn số danh mục hiển thị
 * @returns {Array<{path: string[], label: string, image: string|null}>}
 */
export function getFeaturedSubcategories(products, limit = 16) {
  const map = new Map();
  products.forEach((p) => {
    p.categoryPaths.forEach((path) => {
      if (path.length < 2) return;
      const key = path.slice(0, 2).join(' > ');
      if (!map.has(key)) {
        map.set(key, { path: path.slice(0, 2), label: path[1], image: p.images[0] || null });
      } else if (!map.get(key).image && p.images[0]) {
        map.get(key).image = p.images[0];
      }
    });
  });
  return Array.from(map.values()).slice(0, limit);
}

/**
 * Kiểm tra 1 danh mục có "cháu" (cấp 3) hay không — dùng để quyết định
 * mega menu hiển thị dạng lưới nhiều cột hay dropdown đơn giản.
 * @param {object[]} products
 * @param {string} topCategory
 * @returns {boolean}
 */
export function hasGrandchildren(products, topCategory) {
  const children = getChildCategories(products, [topCategory]);
  return children.some((child) => getChildCategories(products, [topCategory, child]).length > 0);
}

