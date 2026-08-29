# HTMVN Shop — Vue 2 Project (không cần WordPress/backend)

Website nội thất xây bằng Vue 2 + Vue Router + Vuex, dữ liệu sản phẩm lấy
trực tiếp từ Google Sheet (CSV), đặt hàng qua Zalo/Messenger. Code chia
theo cấu trúc chuẩn của 1 dự án Vue CLI thực tế — dễ tìm, dễ sửa, dễ mở
rộng sau này.

## 1. Cài đặt lần đầu

Yêu cầu máy đã cài **Node.js** (khuyên dùng bản 18 trở lên) — tải tại
https://nodejs.org nếu chưa có.

```bash
# 1. Cài các thư viện cần thiết
npm install

# 2. Tạo file cấu hình từ mẫu
cp .env.example .env
```

Mở file `.env` vừa tạo, điền:
- `VUE_APP_SHEET_CSV_URL`: link CSV từ Google Sheet (xem mục 3 bên dưới)
- `VUE_APP_ZALO_PHONE`, `VUE_APP_MESSENGER_USERNAME`: kênh nhận đơn hàng
- Các giá trị còn lại tùy chỉnh theo shop của bạn

```bash
# 3. Chạy thử ở máy local
npm run serve
```

Terminal sẽ hiện link dạng `http://localhost:8080` — mở link đó trên
trình duyệt để xem. Sửa code ở đâu, trang tự động load lại ngay (Hot
Reload), không cần restart.

## 2. Build để deploy lên hosting thật

```bash
npm run build
```

Lệnh này tạo ra thư mục `dist/` chứa các file tĩnh (HTML/CSS/JS đã tối
ưu). Upload TOÀN BỘ nội dung bên trong `dist/` lên hosting (Hostinger,
Netlify, Vercel, GitHub Pages...) là xong — không cần Node.js hay bất kỳ
server đặc biệt nào ở phía hosting, vì đây là site tĩnh hoàn toàn.

**Lưu ý khi deploy** (vì router dùng chế độ "history" — URL đẹp không có
dấu `#`): cần cấu hình hosting để mọi đường dẫn đều trả về `index.html`
(gọi là "fallback" hoặc "rewrite rule"). Cách làm cho từng nơi phổ biến:
- **Netlify**: tạo file `dist/_redirects` với nội dung `/* /index.html 200`
- **Hostinger (Apache)**: tạo file `dist/.htaccess` với nội dung:
  ```
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```
- **Vercel**: tự động nhận diện dự án Vue, không cần cấu hình thêm

## 3. Cách lấy link Google Sheet CSV (nguồn dữ liệu sản phẩm)

1. Mở Google Sheets, import file Excel mẫu `du-lieu-mau-san-pham.xlsx`
   (**File → Import → Upload**), hoặc tạo sheet mới với đúng các cột:
   `SKU, Name, Categories, Regular price, Sale price, Images, Short description, Description, In stock?, Published, Colors`

   Cột **`Colors`** là TÙY CHỌN — dùng khi sản phẩm có nhiều màu/kiểu gỗ
   để khách chọn ở trang chi tiết. Định dạng: mỗi màu cách nhau bởi `;`,
   trong 1 màu thì `Tên màu|URL ảnh mẫu` (ảnh có thể bỏ trống). Ví dụ:
   ```
   Tự Nhiên|https://.../mau-tu-nhien.jpg; Nâu Đỏ|https://.../nau-do.jpg; Xám
   ```
   Sản phẩm không có nhu cầu chọn màu thì để trống cột này.
2. **File → Share → Publish to web**
3. Ở khung chọn, chọn đúng sheet chứa dữ liệu sản phẩm → chọn định dạng
   **"Comma-separated values (.csv)"** → bấm **Publish**
4. Copy link được cấp (dạng `https://docs.google.com/spreadsheets/d/xxx/pub?output=csv`)
5. Dán vào `VUE_APP_SHEET_CSV_URL` trong file `.env`, chạy lại `npm run serve`

### Cập nhật sản phẩm theo danh mục

Cột **"Categories"** quyết định sản phẩm thuộc danh mục nào và mega menu
hiển thị ra sao — dùng dấu `>` để phân cấp cha-con, ví dụ:
`Phòng Khách > Bàn Sofa`. Muốn cập nhật/thêm sản phẩm cho 1 danh mục cụ
thể: mở Google Sheet, lọc/sắp xếp theo cột Categories để tìm đúng nhóm
sản phẩm, sửa hoặc thêm dòng mới với đúng chuỗi danh mục đó — vì Sheet
đã Publish to web, thay đổi có hiệu lực ngay khi người dùng tải lại
trang (không cần build/deploy lại). Menu, trang danh mục, bộ lọc đều tự
động cập nhật theo vì được suy ra 100% từ dữ liệu, không có danh mục nào
viết cứng trong code.

## 4. Cấu trúc thư mục

```
src/
├── main.js                 Điểm khởi động app (không chứa logic nghiệp vụ)
├── App.vue                 Khung tổng: header + router-view + footer
├── config.js                Toàn bộ cấu hình đọc từ .env — sửa hành vi app ở 1 chỗ
├── router/
│   └── index.js             Khai báo URL <-> trang, dùng lazy-loading cho các trang phụ
├── store/                   Vuex — quản lý state dùng chung toàn app
│   ├── index.js
│   └── modules/
│       ├── products.js      Danh sách sản phẩm (tải từ Google Sheet)
│       ├── cart.js          Giỏ hàng + đồng bộ localStorage
│       ├── wishlist.js      Yêu thích + đồng bộ localStorage
│       └── toast.js         Thông báo góc màn hình
├── services/                 Logic "nói chuyện" với thế giới bên ngoài
│   ├── sheetService.js       Gọi + parse Google Sheet CSV
│   ├── cartService.js        Đọc/ghi localStorage cho giỏ hàng
│   ├── wishlistService.js    Đọc/ghi localStorage cho yêu thích
│   └── orderService.js       Soạn nội dung đơn hàng, link Zalo/Messenger
├── utils/                     Hàm thuần túy, không phụ thuộc Vue/Vuex
│   ├── format.js              Định dạng tiền tệ, tính % giảm giá
│   └── category.js            Xử lý cây danh mục từ dữ liệu sản phẩm
├── mixins/
│   └── productActions.js      Logic dùng chung: thêm giỏ hàng / yêu thích / xem nhanh
├── components/
│   ├── layout/                 Header, Footer, MegaMenu, ToastContainer
│   ├── product/                 ProductCard, ProductGrid, QuickViewModal
│   └── common/                  LoadingSpinner, EmptyState (dùng lại nhiều nơi)
├── views/                       Mỗi file = 1 trang, ghép các component lại
│   ├── HomeView.vue
│   ├── ListingView.vue          (dùng chung cho trang danh mục VÀ tìm kiếm)
│   ├── ProductDetailView.vue
│   ├── CartView.vue
│   ├── CheckoutView.vue
│   ├── OrderSuccessView.vue
│   └── WishlistView.vue
└── assets/css/main.css          CSS toàn cục, đổi màu thương hiệu ở khối :root{}
```

## 5. Khi có bug, tìm ở đâu?

| Triệu chứng | Mở file này trước |
|---|---|
| Sản phẩm không hiện / hiện sai | `services/sheetService.js` (cách đọc CSV), kiểm tra link Sheet đã Publish đúng chưa |
| Giỏ hàng tính sai tiền / mất khi tải lại trang | `store/modules/cart.js`, `services/cartService.js` |
| Mega menu thiếu/sai danh mục | `utils/category.js`, cột "Categories" trong Google Sheet |
| Giao diện vỡ/không responsive ở màn hình nào đó | `assets/css/main.css`, tìm đúng class bằng "Inspect Element" |
| Bấm "Đặt hàng" không mở đúng Zalo/Messenger | `services/orderService.js`, kiểm tra `VUE_APP_ZALO_PHONE` / `VUE_APP_MESSENGER_USERNAME` trong `.env` |
| Lỗi khi build (`npm run build` báo đỏ) | Đọc kỹ dòng lỗi — luôn ghi rõ tên file + số dòng, mở đúng file đó |

## 6. Giới hạn cần biết (đã thống nhất trước khi build)

- **Không có backend thật** — giỏ hàng/yêu thích chỉ lưu trên trình
  duyệt hiện tại (localStorage), đơn hàng không được lưu vào bất kỳ đâu
  ngoài việc gửi thủ công qua Zalo/Messenger.
- Dữ liệu sản phẩm phụ thuộc vào Google Sheet còn Publish to web — nếu
  bạn tắt chia sẻ hoặc xóa Sheet, site sẽ không tải được sản phẩm.
- Vì là site tĩnh, không có tìm kiếm/lọc phía server — toàn bộ xử lý ở
  trình duyệt khách, phù hợp với quy mô vài trăm sản phẩm trở xuống; nếu
  catalog lên tới hàng chục nghìn sản phẩm, nên cân nhắc giải pháp có
  backend thật.
