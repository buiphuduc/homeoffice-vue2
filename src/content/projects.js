/**
 * src/content/projects.js
 * ------------------------------------------------------------------
 * Dữ liệu mục "Dự án" (trang /du-an và /du-an/:slug).
 *
 * !!! DỮ LIỆU MẪU THEO BẢN THIẾT KẾ (loại hình, địa điểm, diện tích,
 * năm, câu chuyện, chú thích...) — hãy sửa lại theo đúng thực tế
 * của từng dự án trước khi đưa lên website chính thức.
 *
 * CÁCH THÊM DỰ ÁN MỚI: copy 1 khối trong mảng `projects`, đổi `slug`,
 * `name`, thông tin và ảnh. Không phải sửa giao diện.
 * Nhớ thêm slug mới vào PROJECT_SLUGS trong scripts/generate-sitemap.js.
 *
 * ẢNH: đặt vào public/images/du-an/<slug>/ rồi khai báo trong `spaces`.
 * Quy ước tên: cover.jpg (ảnh bìa), story.jpg (ảnh ngang cuối phần câu
 * chuyện), mat-bang.jpg (ảnh bên cạnh bảng thông tin),
 * <khong-gian>-01.jpg, <khong-gian>-02.jpg ...
 * Ảnh nào chưa có file sẽ tự ẩn; cả không gian chưa có ảnh nào thì
 * hiện khung "Ảnh đang cập nhật".
 *
 * Trường nào để trống ('' / null / []) thì khối tương ứng tự ẩn.
 * ------------------------------------------------------------------
 */

// Tên hiển thị của từng không gian (key dùng làm neo #key trên trang)
export const projectSpaces = {
  'phong-khach': 'Phòng khách',
  'phong-ngu': 'Phòng ngủ',
  'bep-phong-an': 'Bếp & phòng ăn',
  'phong-lam-viec': 'Phòng làm việc',
  'phong-tam': 'Phòng tắm & giặt',
  'goc-rieng': 'Những góc riêng',
};

// Nội dung dùng chung cho các khối kêu gọi liên hệ (CTA)
export const projectUi = {
  // 3 dòng cam kết dưới khối CTA ở trang danh sách
  trust: [
    { icon: 'fa-circle-check', text: 'Ván chống ẩm chuẩn E0 & E1' },
    { icon: 'fa-shield-halved', text: 'Bảo hành theo chính sách HTM' },
    { icon: 'fa-ruler-combined', text: 'Gia công CNC chuẩn xác từng milimet' },
  ],
  // Các dòng gạch đầu dòng trong khối CTA lớn ở trang chi tiết (ngoài dòng Hotline)
  ctaPoints: [
    'Tư vấn giải pháp nội thất phù hợp diện tích và nhu cầu của gia đình.',
  ],
};

/**
 * Sinh danh sách ảnh theo quy ước tên file:
 * /images/du-an/<slug>/<space>-01.jpg, -02.jpg ...
 * captions: mảng chú thích (có thể để ''), độ dài = số ảnh.
 */
function shots(slug, name, spaceKey, captions, label) {
  const l = label || projectSpaces[spaceKey];
  return captions.map((caption, i) => ({
    src: `/images/du-an/${slug}/${spaceKey}-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `${l} – ${name}${caption ? ` (${caption})` : ` (${i + 1})`}`,
    caption,
  }));
}

function basic(slug, name, extra) {
  return {
    slug,
    name,
    subtitle: '', // hiện sau tên ở thẻ dự án: "KA-House - <subtitle>"
    title: `Thiết kế & thi công nội thất – ${name}`,
    type: '', // Nhà phố / Căn hộ / Biệt thự / Văn phòng... (dùng cho bộ lọc)
    location: '', // vd: 'TP. Hồ Chí Minh'
    area: null, // m², để null nếu không công khai
    year: null, // năm hoàn thành
    style: '', // vd: 'Hiện đại, tối giản'
    scope: '', // hạng mục
    materials: '', // vật liệu
    featured: false, // true: thẻ có nhãn "TIÊU BIỂU" và ưu tiên ở trang chủ
    cover: `/images/du-an/${slug}/cover.jpg`,
    coverAlt: `Hình ảnh dự án ${name}`,
    coverCaption: '',
    summary: '', // mô tả ngắn 1–2 dòng (hiện ở "Dự án tương tự")
    seoDescription: `${name} — dự án nội thất do HTM Design & Build thiết kế và thi công. Xem hình ảnh dự án theo từng không gian.`,
    storyTitle: '',
    story: [],
    storyImage: '',
    planImage: '', // ảnh vuông cạnh bảng thông tin (vd: mặt bằng)
    planCaption: '',
    skus: [], // mã sản phẩm HTM đã dùng trong dự án, vd ['BLV01', 'TGY02']
    spaces: [],
    ...extra,
  };
}

export const projects = [
  basic('ka-house', 'KA-House', {
    subtitle: 'Thiết kế & thi công nội thất trọn gói',
    title: 'Thiết kế & thi công nội thất trọn gói – KA-House',
    type: 'Nhà phố',
    location: 'TP. Hồ Chí Minh',
    area: 120,
    year: 2026,
    style: 'Hiện đại, tối giản',
    scope: 'Nội thất phòng khách, bếp & phòng ăn, phòng ngủ, phòng làm việc',
    materials: 'MDF phủ Melamine chống ẩm; MDF tiêu chuẩn E1',
    featured: true,
    coverAlt: 'Phòng khách KA-House tông gỗ sáng và trắng kem',
    coverCaption: 'Phòng khách KA-House – tông gỗ sáng, ánh sáng tự nhiên.',
    summary: 'Nhà phố hiện đại, tối ưu công năng với nội thất ván công nghiệp chống ẩm.',
    storyTitle: 'Hơi thở tự nhiên trong từng nhịp sống',
    story: [
      'Gia chủ mong muốn một tổ ấm bình yên, tối giản và đủ chỗ lưu trữ cho cả gia đình. HTM đã thiết kế lại công năng từng không gian, ưu tiên tông gỗ sáng, trắng kem và những hệ tủ liền tường tận dụng tối đa diện tích.',
      'Toàn bộ nội thất sử dụng ván MDF phủ Melamine chống ẩm, gia công bằng máy móc tự động hóa để các chi tiết khớp chuẩn xác từng milimet.',
    ],
    storyImage: '/images/du-an/ka-house/story.jpg',
    planImage: '/images/du-an/ka-house/mat-bang.jpg',
    planCaption: 'Mặt bằng bố trí công năng tổng thể 120 m² – KA-House',
    spaces: [
      {
        key: 'phong-khach', layout: 'feature', mood: 'Hiện đại', tone: 'Tông gỗ sáng và trắng kem',
        images: shots('ka-house', 'KA-House', 'phong-khach', [
          'Tổng thể phòng khách mở, đón ánh sáng tự nhiên',
          'Kệ tivi nổi treo tường',
          'Tủ trang trí cánh kính',
          'Bàn sofa chữ nhật kệ dưới',
          'Chi tiết vân gỗ trên bề mặt Melamine',
        ]),
      },
      {
        key: 'bep-phong-an', layout: 'grid', mood: 'Tối giản', tone: 'Tủ bếp MDF phủ Melamine chống ẩm',
        images: shots('ka-house', 'KA-House', 'bep-phong-an', [
          'Hệ tủ bếp trên và dưới liền mạch',
          'Góc bàn ăn thân thiện',
          'Tủ lưu trữ cánh phẳng',
          'Chi tiết tay nắm và cạnh ván',
        ]),
      },
      {
        key: 'phong-ngu', label: 'Phòng ngủ Master', layout: 'split', mood: 'Ấm cúng', tone: 'Giường bọc nệm và hệ tủ áo',
        images: shots('ka-house', 'KA-House', 'phong-ngu', [
          'Giường ngủ bệt đầu giường bọc nệm',
          'Tủ đầu giường 2 ngăn kéo',
          'Hệ tủ áo liền tường',
          '',
          '',
        ], 'Phòng ngủ Master'),
      },
      {
        key: 'phong-lam-viec', layout: 'grid', mood: 'Gọn gàng', tone: 'Bàn làm việc gấp gọn tiết kiệm diện tích',
        images: shots('ka-house', 'KA-House', 'phong-lam-viec', [
          'Góc làm việc gọn gàng',
          'Bàn làm việc gấp gọn treo tường',
          '',
          '',
        ]),
      },
    ],
  }),
  basic('p-house', 'P-House', {
    subtitle: 'Căn hộ phong cách tối giản',
    type: 'Căn hộ',
    location: 'TP. Thủ Đức',
    area: 85,
    year: 2025,
    summary: 'Không gian tổ ấm trẻ trung, tinh tế, tối ưu công năng cho căn hộ 85 m².',
    story: ['Nội dung câu chuyện dự án đang được cập nhật.'],
    spaces: [
      { key: 'phong-khach', mood: '', tone: '', images: shots('p-house', 'P-House', 'phong-khach', ['', '', '']) },
      { key: 'phong-ngu', mood: '', tone: '', images: shots('p-house', 'P-House', 'phong-ngu', ['', '', '']) },
    ],
  }),
  basic('t-house', 'T-House', {
    subtitle: 'Không gian sống xanh & tiện ích',
    type: 'Nhà phố',
    location: 'Bình Dương',
    area: 145,
    year: 2025,
    summary: 'Nhà phố hiện đại chú trọng thông gió tự nhiên và ánh sáng.',
    story: ['Nội dung câu chuyện dự án đang được cập nhật.'],
    spaces: [
      { key: 'phong-khach', mood: '', tone: '', images: shots('t-house', 'T-House', 'phong-khach', ['', '', '']) },
      { key: 'phong-ngu', mood: '', tone: '', images: shots('t-house', 'T-House', 'phong-ngu', ['', '', '']) },
    ],
  }),
];
