/**
 * src/content/siteContent.js
 * ------------------------------------------------------------------
 * Nội dung TĨNH của site — khác với sản phẩm (lấy từ Google Sheet/CSV,
 * thay đổi thường xuyên), những nội dung dưới đây là phần "khung"
 * (banner trang chủ, khối giới thiệu, footer, nút liên hệ nổi) ít khi
 * đổi, nên để dạng file cấu hình JS đơn giản — sửa trực tiếp ở đây,
 * không cần đυng vào component nào.
 *
 * Muốn đổi ảnh banner, chữ giới thiệu, số điện thoại nổi... chỉ cần
 * sửa file này rồi lưu lại (dev: tự hot-reload; production: build lại
 * 1 lần `npm run build`).
 * ------------------------------------------------------------------
 */
import config from '@/config';

export default {
  /**
   * Banner lớn bên trái trang chủ (giống khối "GHẾ VĂN PHÒNG" ở site gốc).
   * image: để trống ('') nếu chưa có ảnh -> sẽ hiển thị nền màu trơn thay thế.
   */
  heroPrimary: {
    tag: config.shopName,
    title: 'Nội thất chất lượng cho không gian sống',
    desc: 'Tinh tế trong thiết kế — bền bỉ theo thời gian. Sản phẩm chất lượng với chất liệu chọn lọc.',
    image: '/images/banners/hero-banner.jpg',
    // hasOwnText = true: ảnh đã có sẵn chữ/tiêu đề thiết kế trong hình -> KHÔNG
    // đè thêm chữ HTML lên trên nữa (tránh chồng 2 lớp chữ trông rối mắt).
    hasOwnText: true,
    ctaText: 'Mua ngay',
    ctaCategory: [], // để trống = trỏ về trang "Tất cả sản phẩm"
  },

  /**
   * 2 banner nhỏ xếp chồng bên phải (giống "BÀN KÍCH THƯỚC LỚN" +
   * "KỆ NHÀ BẾP" ở site gốc). Thêm/bớt banner bằng cách thêm/xóa phần
   * tử trong mảng này.
   */
  heroSecondary: [
    {
      title: 'Không gian làm việc rộng rãi',
      desc: 'Nâng tầm hiệu suất làm việc.',
      image: '/images/banners/hero-phong-lam-viec.jpg',
      hasOwnText: true,
      ctaText: 'Mua ngay',
      ctaCategory: [],
    },
    {
      title: 'Kệ nhà bếp gọn gàng',
      desc: 'Tiện lợi · Hiện đại.',
      image: '/images/banners/hero-ke-nha-bep.jpg',
      hasOwnText: true,
      ctaText: 'Mua ngay',
      ctaCategory: [],
    },
  ],

  /**
   * Dải banner khuyến mãi 4 ô dưới hero (giống "BÀN CONSOLE / KỆ ĐỂ GIÀY..."
   * ở site gốc). ctaCategory để trống [] = trỏ về trang tất cả sản phẩm.
   */
  promoStrip: [
    { eyebrow: 'Ưu đãi', title: 'Bàn Console', image: '/images/banners/promo-ban-console.jpg', hasOwnText: false, ctaCategory: [] },
    { eyebrow: 'Ưu đãi', title: 'Ghế Sofa', image: '/images/banners/promo-ghe-sofa.jpg', hasOwnText: false, ctaCategory: [] },
    { eyebrow: 'Ưu đãi', title: 'Ghế Làm Việc', image: '/images/banners/promo-ghe-lam-viec.jpg', hasOwnText: false, ctaCategory: [] },
    { eyebrow: 'Ưu đãi', title: 'Tủ Đầu Giường', image: '/images/banners/promo-tu-dau-giuong.jpg', hasOwnText: false, ctaCategory: [] },
  ],

  /**
   * Banner riêng cho từng danh mục cấp 1 (hiển thị phía trên mỗi khối
   * sản phẩm theo ngành hàng ở trang chủ). Key phải khớp CHÍNH XÁC với
   * tên danh mục cấp 1 trong cột "Categories" của file dữ liệu sản phẩm.
   * Danh mục nào không có banner ở đây sẽ tự động rơi về hiển thị dạng
   * icon tròn đơn giản (không lỗi, không cần khai báo đủ hết).
   */
  categoryBanners: {
    'Nội thất văn phòng': '/images/banners/noi-that-van-phong.jpg',
    'Phòng Khách': '/images/banners/phong-khach.jpg',
    'Bếp & Phòng Ăn': '/images/banners/bep-phong-an.jpg',
    'Phòng Ngủ': '/images/banners/phong-ngu.jpg',
    'Phòng Làm Việc': '/images/banners/phong-lam-viec.jpg',
    'Bàn ghế Cafe - Ngoài trời': '/images/banners/ban-ghe-cafe.jpg',
    'Phụ Kiện': '/images/banners/phu-kien.jpg',
    'Ống Nước': '/images/banners/ong-nuoc.jpg',
    'Trường Học': '/images/banners/truong-hoc.jpg',
    'Phòng Tắm': '/images/banners/phong-tam.jpg',
  },

  /**
   * Chính sách vận chuyển & bảo hành — hiển thị GIỐNG NHAU trên mọi
   * trang chi tiết sản phẩm (đúng như bạn mô tả). Sửa nội dung ở ĐÂY,
   * áp dụng cho toàn bộ sản phẩm, không cần sửa từng dòng trong Sheet.
   *
   * "images": 2 Ô ẢNH CHỪA SẴN — dán URL ảnh chính sách vận chuyển thật
   * của bạn vào đây (ảnh dạng infographic/bảng giá bạn đã thiết kế sẵn).
   * Để trống ('') nếu chưa có ảnh — chỗ đó sẽ hiện khung nét đứt nhắc bạn.
   */
  shippingPolicy: {
    title: 'Chính sách vận chuyển',
    intro: 'Áp dụng cho đơn hàng giao trong nội thành và các khu vực lân cận. Phí có thể thay đổi theo kích thước/khối lượng thực tế của sản phẩm.',
    images: [
      '', // Ảnh 1: bảng giá giao xe máy / hàng cồng kềnh theo khu vực
      '', // Ảnh 2: bảng phí vận chuyển & lắp ráp chi tiết
    ],
    confirmationNote: 'Đơn hàng đặt trong giờ hành chính sẽ được gọi điện xác nhận trong vòng 30-60 phút. Đơn đặt ngoài giờ hoặc ngày nghỉ sẽ được xử lý vào ngày làm việc kế tiếp.',
  },

  warrantyPolicy: {
    title: 'Chính sách bảo hành',
    intro: 'Vui lòng kiểm tra hàng trước khi thanh toán. Toàn bộ sản phẩm được bảo hành miễn phí trong thời gian quy định kể từ ngày giao hàng và lắp đặt hoàn thiện.',
    sections: [
      {
        heading: 'Ghế văn phòng / Ghế cafe / Ghế ăn',
        covered: [
          'Lỗi từ nhà sản xuất trong quá trình sản xuất hoặc vận chuyển.',
          'Khung chân, khung lưng bị gãy hoặc mối hàn bị nứt do lỗi kỹ thuật.',
        ],
        notCovered: [
          'Sản phẩm đã quá thời hạn bảo hành.',
          'Hư hỏng do tác động từ bên ngoài: rơi, va đập, trầy xước trong quá trình sử dụng.',
          'Phần vải/da/simili bọc ghế bị rách do sử dụng.',
        ],
      },
      {
        heading: 'Bàn, tủ văn phòng / Tủ kệ gỗ',
        covered: [
          'Lỗi từ nhà sản xuất trong quá trình sản xuất hoặc vận chuyển.',
          'Mặt bàn bị trầy xước, cong vênh nghiêm trọng do lỗi vật liệu.',
        ],
        notCovered: [
          'Hao mòn tự nhiên do thời gian sử dụng lâu dài, hoặc do thường xuyên tiếp xúc ánh nắng/mưa/ẩm mốc.',
          'Hư hỏng do bất cẩn trong quá trình tháo lắp, vận chuyển tự ý (không qua đội kỹ thuật của shop).',
        ],
      },
    ],
    contactNote: `Để yêu cầu bảo hành, vui lòng liên hệ hotline ${config.hotlineDisplay} hoặc gửi hình ảnh tình trạng sản phẩm qua Zalo/Messenger.`,
  },

  /** Khối "4 tính năng nổi bật" (giống "SẢN PHẨM NỘI THẤT HOMEOFFICE" ở site gốc) */
  featureHighlights: [
    {
      number: 1,
      title: 'Chất liệu ưu việt',
      desc: 'Chất liệu tạo nên sản phẩm nội thất luôn là yếu tố quan trọng nhất, được lựa chọn kỹ càng từ các nhà cung cấp tốt nhất.',
    },
    {
      number: 2,
      title: 'Sản xuất hoàn thiện',
      desc: 'Sản phẩm hoàn thiện qua quá trình sản xuất và chất lượng thi công từ bàn tay những người thợ lành nghề.',
    },
    {
      number: 3,
      title: 'Thiết kế phù hợp',
      desc: 'Thiết kế đơn giản dựa trên các nguyên tắc chuẩn, nghiên cứu từ kiểu dáng đến quy cách phù hợp với tiêu chuẩn.',
    },
    {
      number: 4,
      title: 'Cá nhân hóa',
      desc: 'Bạn cần một kích thước khác, một sự tùy biến về màu sắc — chỉ đơn giản là liên hệ với chúng tôi.',
    },
  ],

  /**
   * Footer nhiều cột. Cột nào có "route" thì render thành link thật
   * (router-link) trỏ tới trang tương ứng trong app; cột nào chỉ có
   * "text" (không có route) thì hiển thị dạng chữ thường — vì đây là
   * site không có hệ thống trang tĩnh (CMS pages) như site gốc, tránh
   * tạo link giả dẫn tới trang không tồn tại.
   */
  footerColumns: [
    {
      title: 'Hỗ trợ khách hàng',
      items: [
        { text: `Hotline: ${config.hotlineDisplay}` },
        { text: 'Liên hệ qua Zalo/Messenger ở nút góc phải màn hình' },
      ],
    },
    {
      title: `Về ${config.shopName}`,
      items: [
        { text: 'Giới thiệu', link: '/gioi-thieu' },
        { text: 'Liên hệ', link: '/lien-he' },
        { text: 'Tuyển dụng' },
        { text: 'Dự án đã thi công' },
        { text: 'Cảm hứng sáng tạo', link: '/cam-hung-sang-tao' },
      ],
    },
    {
      title: 'Dịch vụ khách hàng',
      items: [
        { text: 'Câu hỏi thường gặp' },
        { text: 'Hướng dẫn đặt hàng' },
        { text: 'Chính sách vận chuyển' },
        { text: 'Chính sách bảo hành' },
      ],
    },
    {
      title: 'Danh mục',
      // Cột này link thật tới trang danh mục — sẽ tự lấy danh mục thật
      // từ dữ liệu sản phẩm trong HomeView.vue (xem <template> ở đó),
      // không khai báo cứng ở đây.
      dynamicCategoryLinks: true,
      items: [],
    },
  ],
};
