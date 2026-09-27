/**
 * src/content/inspirationArticles.js
 * ------------------------------------------------------------------
 * Nội dung đầy đủ cho từng bài "Cảm hứng sáng tạo". InspirationView.vue
 * (trang danh sách) chỉ đọc `category/tag/title/excerpt/cover` để hiển
 * thị teaser; InspirationArticleView.vue (trang chi tiết, route
 * /cam-hung-sang-tao/:slug) đọc toàn bộ `sections` + `cta` để dựng bài
 * viết đầy đủ kèm ảnh minh hoạ.
 *
 * Mỗi bài có tối thiểu 2 ảnh (cover + ít nhất 1 ảnh trong nội dung) để
 * đảm bảo trang chi tiết luôn có hình minh hoạ rõ ràng, không phải toàn
 * chữ. Ảnh nào chưa có file thật sẽ tự hiện icon placeholder (xem xử lý
 * lỗi ảnh trong InspirationArticleView.vue) — prompt tạo ảnh AI cho
 * từng file được liệt kê trong phần trả lời kèm theo, không lặp lại ở
 * đây để tránh trùng lặp.
 *
 * `cta`: điểm đến "mua sắm" ở cuối bài — luôn trỏ tới danh mục/tìm kiếm
 * sản phẩm CÓ THẬT trong dữ liệu (xem product.js), không bịa route ảo.
 *
 * File này là dữ liệu tĩnh thuần (không phải Vue template) nên những
 * đoạn cần chèn tên thương hiệu dùng JS template literal với
 * `config.shopName` thật — KHÔNG dùng cú pháp "{{ }}" của Vue ở đây vì
 * nội dung được hiển thị qua v-html, Vue sẽ không compile lại lần 2.
 * ------------------------------------------------------------------
 */
import config from '@/config';

export default [
  {
    slug: 'anh-sang-bac-au',
    category: 'PHÒNG KHÁCH',
    tag: 'Ý tưởng chiếu sáng',
    title: 'Nghệ thuật ánh sáng trong không gian Bắc Âu',
    excerpt: 'Làm thế nào để tối đa hóa ánh sáng tự nhiên và sử dụng đèn trang trí để tạo ra bầu không khí ấm cúng (hygge) trong những ngày đông giá lạnh.',
    readTime: 'Đọc 5 phút',
    cover: '/images/cam-hung/anh-sang-bac-au.jpg',
    coverAlt: 'Phòng khách ngập ánh sáng tự nhiên theo phong cách Bắc Âu',
    intro: 'Ánh sáng là "vật liệu" vô hình nhưng quan trọng bậc nhất trong một không gian sống mang tinh thần Scandinavian. Không cần nội thất đắt tiền, chỉ cần bố trí ánh sáng đúng cách, căn phòng đã đủ ấm áp và thư thái.',
    sections: [
      {
        heading: 'Tận dụng tối đa ánh sáng tự nhiên',
        body: 'Ưu tiên rèm mỏng (voan, linen) thay vì rèm dày để ánh sáng ban ngày khuếch tán đều khắp phòng thay vì bị chặn đứng. Đặt gương lớn đối diện cửa sổ giúp nhân đôi hiệu ứng ánh sáng mà không cần thêm đèn. Hạn chế nội thất cao che khuất cửa sổ, giữ đường nhìn xuyên suốt ra bên ngoài.',
        image: '/images/cam-hung/anh-sang-cua-so.jpg',
        imageAlt: 'Cửa sổ lớn với rèm voan mỏng để ánh sáng tự nhiên tràn vào phòng khách',
      },
      {
        heading: 'Ánh sáng nhân tạo ấm áp cho buổi tối',
        body: 'Khi trời tắt nắng, thay vì bật một nguồn đèn trần duy nhất, hãy phân lớp ánh sáng: đèn sàn góc đọc sách, đèn bàn cạnh sofa, và đèn tường dịu nhẹ. Chọn nhiệt độ màu ấm (2700–3000K) thay vì ánh sáng trắng lạnh để giữ đúng tinh thần "hygge" — dễ chịu, riêng tư, không chói mắt.',
        image: '/images/cam-hung/den-ban-am-cung.jpg',
        imageAlt: 'Đèn bàn ánh sáng vàng ấm đặt cạnh sofa vào buổi tối',
      },
    ],
    cta: { type: 'category', path: ['Phòng Khách'], label: 'Khám phá nội thất phòng khách' },
  },
  {
    slug: 've-dep-go-soi',
    category: 'PHÒNG KHÁCH',
    tag: 'Vật liệu',
    title: 'Vẻ đẹp vượt thời gian của gỗ sồi',
    excerpt: 'Vì sao gỗ sồi tự nhiên luôn là lựa chọn hàng đầu cho nội thất bền đẹp theo năm tháng, và cách chăm sóc để giữ vẻ đẹp nguyên bản của thớ gỗ.',
    readTime: 'Đọc 4 phút',
    cover: '/images/cam-hung/ban-go-soi.jpg',
    coverAlt: 'Bàn sofa gỗ sồi tự nhiên nguyên khối',
    intro: 'Gỗ sồi tự nhiên nguyên khối là một trong những vật liệu được ưa chuộng nhất trong thiết kế Scandinavian — không chỉ vì độ bền cơ học vượt trội mà còn vì đường vân gỗ đặc trưng, mang lại cảm giác ấm áp, gần gũi cho mọi không gian.',
    sections: [
      {
        heading: 'Vì sao gỗ sồi được ưa chuộng',
        body: 'So với gỗ công nghiệp, gỗ sồi nguyên khối chịu lực tốt hơn, ít cong vênh theo thời gian và có thể sửa chữa/đánh bóng lại nhiều lần. Vân gỗ tự nhiên với các đường vòng đặc trưng khiến mỗi món đồ gần như "độc bản" — không món nào giống món nào.',
        image: '/images/cam-hung/van-go-soi-macro.jpg',
        imageAlt: 'Cận cảnh vân gỗ sồi tự nhiên',
      },
      {
        heading: 'Bảo quản đồ gỗ sồi bền đẹp theo năm tháng',
        body: 'Tránh ánh nắng trực tiếp kéo dài để không bị bạc màu, dùng khăn ẩm mềm lau bề mặt thay vì hóa chất tẩy rửa mạnh, và định kỳ dùng dầu dưỡng gỗ chuyên dụng mỗi 6–12 tháng để lớp bề mặt luôn có độ bóng tự nhiên.',
        image: '/images/cam-hung/ban-an-go-soi.jpg',
        imageAlt: 'Bàn ăn gỗ sồi tự nhiên trong không gian bếp',
      },
    ],
    cta: { type: 'category', path: ['Phòng Khách', 'Bàn Sofa'], label: 'Xem bàn sofa gỗ sồi' },
  },
  {
    slug: 'mau-trung-tinh-phong-ngu',
    category: 'PHÒNG NGỦ',
    tag: 'Ý tưởng phòng ngủ',
    title: 'Sự tĩnh lặng của màu trung tính',
    excerpt: 'Bảng màu trung tính — be, kem, nâu đất — là chìa khóa tạo nên một phòng ngủ tĩnh lặng, dễ chịu, giúp giấc ngủ đến nhẹ nhàng hơn mỗi ngày.',
    readTime: 'Đọc 4 phút',
    cover: '/images/cam-hung/phong-ngu-trung-tinh.jpg',
    coverAlt: 'Phòng ngủ tối giản tông màu trung tính ấm áp',
    intro: 'Một phòng ngủ đẹp không cần nhiều màu sắc rực rỡ. Bảng màu trung tính giúp không gian trông rộng hơn, dịu mắt hơn, và quan trọng nhất — không bao giờ lỗi thời.',
    sections: [
      {
        heading: 'Bảng màu trung tính chuẩn Hygge',
        body: 'Kết hợp 2–3 tông màu be/kem/nâu đất làm nền, sau đó thêm 1 điểm nhấn nhẹ (xanh rêu, nâu gỗ đậm) qua chăn gối hoặc thảm trải. Tránh phối quá 3 tông màu chính để không gian không bị rối mắt.',
        image: '/images/cam-hung/phong-ngu-chi-tiet-vai.jpg',
        imageAlt: 'Cận cảnh chăn ga gối bằng vải linen tông màu trung tính',
      },
      {
        heading: 'Bố trí ánh sáng và vật liệu tự nhiên',
        body: 'Ưu tiên vật liệu tự nhiên: gỗ, linen, len — chúng phản chiếu ánh sáng dịu hơn nhựa hay kim loại bóng. Một chiếc đèn ngủ ánh vàng ấm đặt cạnh giường sẽ hoàn thiện không khí thư giãn cho cả căn phòng.',
        image: '/images/cam-hung/phong-ngu-goc-nho.jpg',
        imageAlt: 'Góc nhỏ cạnh giường ngủ với đèn bàn và vật liệu gỗ tự nhiên',
      },
    ],
    cta: { type: 'category', path: ['Phòng Ngủ'], label: 'Khám phá nội thất phòng ngủ' },
  },
  {
    slug: 'phoi-vai-khong-gian-nho',
    category: 'VẬT LIỆU & XU HƯỚNG',
    tag: 'Hướng dẫn',
    title: 'Cách phối hợp các kết cấu vải trong không gian nhỏ',
    excerpt: 'Việc sử dụng các loại vải khác nhau như linen, len và boucle có thể tạo thêm chiều sâu cho căn phòng mà không làm rối mắt.',
    readTime: 'Đọc 6 phút',
    cover: '/images/cam-hung/mau-vai-boc.jpg',
    coverAlt: 'Các mẫu vải bọc nội thất: linen, len, boucle',
    intro: 'Với những căn phòng diện tích khiêm tốn, phối màu là chưa đủ — phối kết cấu (texture) mới là điều tạo nên chiều sâu thị giác mà không cần thêm màu sắc hay đồ đạc.',
    sections: [
      {
        heading: 'Ba loại vải nên có trong nhà',
        body: 'Linen (đũi lanh) cho cảm giác thô mộc, thoáng mát — hợp làm rèm cửa hoặc bọc ghế mùa hè. Len (wool) ấm áp, hợp làm thảm hoặc chăn trong những tháng lạnh. Boucle với kết cấu xoăn đặc trưng là điểm nhấn hiện đại, thường thấy trên các mẫu ghế sofa/ghế bành gần đây.',
        image: '/images/cam-hung/goc-doc-fabric-throw.jpg',
        imageAlt: 'Ghế bành bọc vải boucle cùng chăn linen và gối len trong góc phòng nhỏ',
      },
      {
        heading: 'Nguyên tắc phối không rối mắt',
        body: 'Giữ tông màu đồng nhất (cùng gam trung tính) nhưng đổi kết cấu giữa các món: ghế sofa vải nỉ mịn, gối tựa len thô, thảm sợi tự nhiên. Quy tắc "tối đa 3 kết cấu khác nhau trong 1 khung nhìn" giúp không gian nhỏ không bị rối mắt.',
      },
    ],
    cta: { type: 'search', query: 'vải', label: 'Xem sản phẩm bọc vải' },
  },
  {
    slug: 'bep-toi-gian-cong-nang',
    category: 'BẾP & PHÒNG ĂN',
    tag: 'Bếp & phòng ăn',
    title: 'Tối giản công năng cho gian bếp nhỏ',
    excerpt: 'Một gian bếp nhỏ vẫn có thể đầy đủ công năng nếu được bố trí thông minh — đây là những nguyên tắc cốt lõi theo phong cách Scandinavian.',
    readTime: 'Đọc 4 phút',
    cover: '/images/cam-hung/bep-toi-gian.jpg',
    coverAlt: 'Gian bếp tối giản phong cách Scandinavian',
    intro: 'Bếp Scandinavian không chạy theo diện tích lớn, mà chạy theo sự hợp lý: mọi thứ đều có chỗ của nó, mặt bàn luôn thông thoáng, và vật liệu được chọn để dùng bền lâu.',
    sections: [
      {
        heading: 'Nguyên tắc "tam giác bếp"',
        body: 'Bố trí khu vực lưu trữ (tủ lạnh) — khu rửa (bồn rửa) — khu nấu (bếp) theo hình tam giác để thao tác nấu nướng thuận tiện nhất, hạn chế di chuyển thừa trong không gian hẹp.',
      },
      {
        heading: 'Lưu trữ thông minh, mặt bàn luôn gọn',
        body: 'Ưu tiên tủ bếp kịch trần để tận dụng chiều cao, dùng ngăn kéo chia ô thay vì tủ mở, và chỉ để trên mặt bàn những vật dụng dùng hằng ngày. Mặt bàn càng gọn, gian bếp nhỏ càng trông rộng rãi hơn.',
        image: '/images/cam-hung/bep-luu-tru-thong-minh.jpg',
        imageAlt: 'Tủ bếp kịch trần với hệ ngăn kéo lưu trữ gọn gàng',
      },
    ],
    cta: { type: 'category', path: ['Bếp & Phòng Ăn'], label: 'Khám phá nội thất bếp & phòng ăn' },
  },
  {
    slug: 'ban-ben-sofa-dang-tron',
    category: 'PHÒNG KHÁCH',
    tag: 'Gợi ý sản phẩm',
    title: 'Bàn bên sofa dáng tròn — điểm nhấn tinh tế',
    excerpt: 'Một chiếc bàn bên sofa dáng tròn nhỏ gọn có thể thay đổi hoàn toàn cảm giác của cả góc phòng khách.',
    readTime: 'Đọc 3 phút',
    cover: '/images/cam-hung/ban-ben-sofa.jpg',
    coverAlt: 'Bàn bên sofa dáng tròn mặt gỗ',
    intro: 'Không phải lúc nào phòng khách cũng cần một chiếc bàn trà lớn ở trung tâm. Với không gian nhỏ hoặc cách bố trí hiện đại, một chiếc bàn bên sofa dáng tròn thường linh hoạt và tinh tế hơn nhiều.',
    sections: [
      {
        heading: 'Vì sao chọn dáng tròn cho không gian nhỏ',
        body: 'Bàn tròn không có góc cạnh nên tạo cảm giác thông thoáng, dễ len lỏi vào các góc phòng hẹp, đồng thời an toàn hơn cho nhà có trẻ nhỏ. Kích thước nhỏ gọn giúp dễ dàng di chuyển, thay đổi bố cục phòng khách bất cứ lúc nào.',
        image: '/images/cam-hung/ban-ben-sofa-goc-canh.jpg',
        imageAlt: 'Bàn bên sofa dáng tròn đặt cạnh ghế sofa trong phòng khách',
      },
      {
        heading: 'Cách phối cùng sofa và thảm trải sàn',
        body: 'Đặt bàn ngang tầm tay vịn sofa, chọn chất liệu mặt bàn tương phản nhẹ với sàn nhà (gỗ sáng trên sàn tối hoặc ngược lại), và giữ mặt bàn gọn gàng — chỉ 1–2 món trang trí nhỏ (đèn bàn, tách trà, sách) là đủ.',
      },
    ],
    cta: { type: 'category', path: ['Phòng Khách', 'Bàn Bên Sofa'], label: 'Xem sản phẩm' },
  },
  {
    slug: 'goc-doc-sach-hoan-hao',
    category: 'PHÒNG KHÁCH',
    tag: 'Góc thư giãn',
    title: 'Góc đọc sách hoàn hảo',
    excerpt: 'Chỉ với một chiếc ghế êm, ánh sáng phù hợp và một góc yên tĩnh cạnh cửa sổ, bạn đã có thể tạo nên góc đọc sách trong mơ.',
    readTime: 'Đọc 3 phút',
    cover: '/images/cam-hung/goc-doc-sach.jpg',
    coverAlt: 'Góc đọc sách ấm cúng cạnh cửa sổ',
    intro: 'Một góc đọc sách đẹp không cần nhiều diện tích — chỉ cần đúng 3 yếu tố: vị trí, ánh sáng, và một chiếc ghế thực sự thoải mái.',
    sections: [
      {
        heading: 'Chọn vị trí và ánh sáng',
        body: 'Ưu tiên góc gần cửa sổ để tận dụng ánh sáng ban ngày. Buổi tối, một chiếc đèn đọc sách có thể chỉnh hướng ánh sáng sẽ tốt hơn nhiều so với đèn trần chung — tránh mỏi mắt khi đọc lâu.',
        image: '/images/cam-hung/goc-doc-sach-den-ban.jpg',
        imageAlt: 'Đèn đọc sách đặt cạnh ghế bành trong góc đọc sách',
      },
      {
        heading: 'Chọn ghế và phụ kiện đi kèm',
        body: 'Một chiếc ghế bành êm ái với tựa lưng cao sẽ nâng đỡ tốt hơn khi ngồi đọc lâu. Thêm một chiếc bàn nhỏ để tách trà, một tấm chăn mỏng, và kệ sách trong tầm tay — vậy là đủ cho một góc thư giãn trọn vẹn.',
      },
    ],
    cta: { type: 'category', path: ['Phòng Khách'], label: 'Khám phá nội thất phòng khách' },
  },
  {
    slug: 'xu-huong-biophilic-design',
    category: 'VẬT LIỆU & XU HƯỚNG',
    tag: 'Xu hướng',
    title: 'Trở về với tự nhiên: Xu hướng Biophilic Design',
    excerpt: 'Mang thiên nhiên vào nhà không chỉ dừng lại ở việc đặt vài chậu cây, mà là sự kết nối sâu sắc thông qua vật liệu và ánh sáng.',
    readTime: 'Đọc 5 phút',
    cover: '/images/cam-hung/biophilic-phong-khach.jpg',
    coverAlt: 'Phòng khách theo xu hướng Biophilic Design với nhiều cây xanh và vật liệu tự nhiên',
    intro: 'Biophilic Design (thiết kế thân thiện sinh học) là xu hướng đưa các yếu tố tự nhiên — ánh sáng, cây xanh, vật liệu thô mộc — vào không gian sống hiện đại, giúp giảm căng thẳng và tăng cảm giác kết nối với thiên nhiên.',
    sections: [
      {
        heading: 'Biophilic Design là gì?',
        body: 'Khác với việc chỉ trang trí bằng cây cảnh, Biophilic Design hướng tới việc tối ưu ánh sáng tự nhiên, luồng không khí, và sử dụng vật liệu có nguồn gốc tự nhiên (gỗ, mây, đá) để tạo cảm giác gần gũi với môi trường sống bên ngoài.',
        image: '/images/cam-hung/biophilic-cay-xanh.jpg',
        imageAlt: 'Cây xanh trong chậu gốm đặt cạnh cửa sổ lớn',
      },
      {
        heading: 'Ứng dụng vào nội thất',
        body: `Ưu tiên nội thất từ mây tre đan, gỗ tự nhiên, vải cotton/linen thay vì nhựa hay kim loại công nghiệp — đây cũng là những vật liệu ${config.shopName} lựa chọn cho nhiều dòng sản phẩm. Kết hợp thêm chậu cây, ánh sáng tự nhiên và bề mặt đá tự nhiên để hoàn thiện không gian.`,
        image: '/images/cam-hung/biophilic-vat-lieu-tu-nhien.jpg',
        imageAlt: 'Nội thất mây tre đan kết hợp khung gỗ tự nhiên',
      },
    ],
    cta: { type: 'route', to: '/gioi-thieu', label: 'Tìm hiểu thêm về vật liệu' },
  },
];
