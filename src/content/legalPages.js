import config from '@/config';
import siteContent from '@/content/siteContent';

/**
 * src/content/legalPages.js
 * ------------------------------------------------------------------
 * Nội dung 3 trang pháp lý cơ bản, hiển thị qua route /chinh-sach/:slug
 * (xem LegalPageView.vue). Đây là bản DRAFT chuyên nghiệp dựa trên thực
 * tế mô hình vận hành hiện tại của site (đặt hàng qua Zalo/Messenger,
 * không có tài khoản người dùng, không thu thập thanh toán online) —
 * BẠN NÊN RÀ SOÁT LẠI các con số cụ thể (số ngày đổi trả, ai chịu phí
 * vận chuyển...) cho khớp với chính sách thật của công ty trước khi
 * công bố chính thức. Đây không phải tư vấn pháp lý.
 * ------------------------------------------------------------------
 */
const companyLine = `${config.shopName} là thương hiệu nội thất trực thuộc CÔNG TY TNHH KỸ THUẬT HTM.`;

export default [
  {
    slug: 'doi-tra',
    title: 'Chính sách đổi trả',
    updatedAt: 'Cập nhật lần cuối: 2026',
    sections: [
      {
        heading: 'Điều kiện đổi trả',
        body: `${companyLine} Chúng tôi hỗ trợ đổi hoặc trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng, áp dụng khi sản phẩm còn nguyên vẹn, chưa qua sử dụng/lắp đặt, còn đầy đủ bao bì, phụ kiện đi kèm và hóa đơn/xác nhận đơn hàng.`,
      },
      {
        heading: 'Trường hợp lỗi do nhà sản xuất/vận chuyển',
        body: 'Nếu sản phẩm bị lỗi kỹ thuật, hư hỏng do sản xuất hoặc va đập trong quá trình vận chuyển, chúng tôi hoàn toàn chịu trách nhiệm đổi mới hoặc sửa chữa miễn phí, đồng thời chi trả toàn bộ chi phí vận chuyển hai chiều.',
      },
      {
        heading: 'Trường hợp đổi ý (không do lỗi sản phẩm)',
        body: 'Khách hàng đổi ý muốn đổi/trả khi sản phẩm không lỗi sẽ chịu chi phí vận chuyển hai chiều. Một số sản phẩm đặt đóng theo yêu cầu riêng (kích thước, màu sắc tùy chỉnh) có thể không áp dụng đổi trả — thông tin này sẽ được thông báo rõ khi tư vấn đặt hàng.',
      },
      {
        heading: 'Cách thức yêu cầu đổi trả',
        body: `Liên hệ trực tiếp qua Hotline ${config.hotlineDisplay} hoặc Zalo/Messenger kèm hình ảnh/video sản phẩm và mã đơn hàng. Chúng tôi sẽ phản hồi và hướng dẫn quy trình trong vòng 24 giờ làm việc.`,
      },
    ],
  },
  {
    slug: 'bao-mat',
    title: 'Chính sách bảo mật',
    updatedAt: 'Cập nhật lần cuối: 2026',
    sections: [
      {
        heading: 'Thông tin chúng tôi thu thập',
        body: `${companyLine} Website hiện KHÔNG yêu cầu đăng ký tài khoản và không lưu trữ dữ liệu cá nhân trên máy chủ. Giỏ hàng và danh sách yêu thích của bạn chỉ được lưu cục bộ trên trình duyệt của chính bạn (localStorage), chúng tôi không truy cập hay nhìn thấy được dữ liệu này.`,
      },
      {
        heading: 'Thông tin bạn chủ động cung cấp',
        body: 'Khi bạn điền form Liên hệ hoặc form Đặt hàng (họ tên, số điện thoại, địa chỉ, email, nội dung nhắn), thông tin này được gửi trực tiếp tới hộp thoại Zalo/Messenger hoặc email của chúng tôi để xử lý đơn hàng/yêu cầu — chúng tôi không lưu vào cơ sở dữ liệu nào khác và không chia sẻ cho bên thứ ba ngoài mục đích xử lý đơn hàng của chính bạn.',
      },
      {
        heading: 'Cookie & công cụ theo dõi',
        body: 'Hiện tại website không sử dụng cookie theo dõi hay công cụ quảng cáo/phân tích của bên thứ ba (Google Analytics, Facebook Pixel...). Nếu trong tương lai chúng tôi bổ sung các công cụ này, chính sách sẽ được cập nhật và thông báo rõ trên trang này.',
      },
      {
        heading: 'Quyền của bạn',
        body: `Bạn có thể yêu cầu chúng tôi xóa thông tin liên hệ đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua Email ${siteContent.companyInfo.email} hoặc Hotline ${config.hotlineDisplay}.`,
      },
    ],
  },
  {
    slug: 'dieu-khoan',
    title: 'Điều khoản sử dụng',
    updatedAt: 'Cập nhật lần cuối: 2026',
    sections: [
      {
        heading: 'Giới thiệu chung',
        body: `Khi truy cập và sử dụng website ${config.shopName}, bạn đồng ý với các điều khoản dưới đây. ${companyLine}`,
      },
      {
        heading: 'Thông tin sản phẩm & giá bán',
        body: 'Chúng tôi nỗ lực đảm bảo hình ảnh, mô tả và giá sản phẩm hiển thị chính xác tại thời điểm đăng tải. Tuy nhiên, giá bán, thông số kích thước/chất liệu có thể thay đổi mà không báo trước do biến động nguyên vật liệu — giá và thông tin cuối cùng sẽ được xác nhận lại với khách hàng qua Zalo/Messenger/điện thoại trước khi chốt đơn.',
      },
      {
        heading: 'Đặt hàng',
        body: 'Đơn hàng đặt qua website chỉ là YÊU CẦU đặt hàng ban đầu, chưa phải xác nhận giao dịch cuối cùng. Đơn hàng chính thức được xác nhận sau khi đội ngũ tư vấn liên hệ lại qua Hotline/Zalo/Messenger để chốt thông tin sản phẩm, giá, thời gian giao hàng.',
      },
      {
        heading: 'Quyền sở hữu trí tuệ',
        body: `Toàn bộ nội dung, hình ảnh, thiết kế trên website thuộc quyền sở hữu của ${companyLine} Nghiêm cấm sao chép, sử dụng cho mục đích thương mại khác khi chưa có sự đồng ý bằng văn bản.`,
      },
      {
        heading: 'Luật áp dụng',
        body: 'Các điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng thiện chí giữa hai bên.',
      },
    ],
  },
];
