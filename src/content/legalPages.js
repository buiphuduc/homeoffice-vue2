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
    description: `Chính sách đổi trả sản phẩm của ${config.shopName}: kiểm tra hàng khi nhận, đổi mới trong 7 ngày nếu lỗi từ nhà sản xuất.`,
    sections: [
      {
        heading: 'Kiểm tra hàng khi nhận',
        body: `${companyLine} Đề nghị quý khách kiểm tra hàng trước khi thanh toán. Sau khi nhận hàng, quý khách không được trả lại hàng nếu không thuộc trường hợp đổi mới được nêu dưới đây.`,
      },
      {
        heading: 'Đổi mới trong vòng 7 ngày',
        body: 'Sản phẩm được đổi mới trong vòng 7 ngày kể từ ngày nhận hàng nếu phát sinh lỗi từ nhà sản xuất. Chính sách này chỉ áp dụng đối với các sản phẩm có sẵn; không áp dụng đối với sản phẩm đặt theo thiết kế hoặc theo yêu cầu riêng của khách hàng.',
      },
      {
        heading: 'Các trường hợp không áp dụng đổi trả',
        blocks: [
          {
            type: 'ul',
            items: [
              'Khách hàng đổi ý, không còn nhu cầu sử dụng khi sản phẩm không có lỗi.',
              'Sản phẩm đặt theo thiết kế, kích thước hoặc màu sắc theo yêu cầu riêng.',
              'Sản phẩm hư hỏng do tác động từ bên ngoài (rơi, va đập, trầy xước, hỏa hoạn...) hoặc do tháo lắp, sử dụng không đúng cách.',
            ],
          },
          { type: 'note', text: 'Sản phẩm phát sinh lỗi sau 7 ngày nhưng vẫn còn trong thời hạn bảo hành sẽ được xử lý theo Chính sách bảo hành.' },
        ],
      },
      {
        heading: 'Cách thức yêu cầu đổi mới',
        body: `Liên hệ Hotline ${config.hotlineDisplay} hoặc Zalo/Messenger của ${config.shopName}, kèm hình ảnh/video tình trạng sản phẩm và mã đơn hàng. Chúng tôi sẽ phản hồi đã tiếp nhận yêu cầu trong vòng 3 giờ làm việc.`,
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
        body: 'Khi bạn điền form Liên hệ (họ tên, số điện thoại, email, nội dung nhắn), thông tin được gửi trực tiếp tới hộp thư Gmail của chúng tôi thông qua hệ thống tự vận hành trên Google Apps Script (không qua dịch vụ trung gian bên thứ ba); form Đặt hàng được gửi qua Zalo/Messenger của chúng tôi. Chúng tôi chỉ dùng thông tin này để liên hệ và xử lý yêu cầu/đơn hàng của chính bạn, không chia sẻ cho bên thứ ba vì mục đích khác.',
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
  {
    slug: 'van-chuyen',
    title: 'Chính sách vận chuyển',
    updatedAt: 'Cập nhật lần cuối: 2026',
    description: `Bảng phí vận chuyển và lắp ráp của ${config.shopName} theo khu vực TP. Hồ Chí Minh và ngoại tỉnh, thời gian xác nhận và giao hàng.`,
    image: {
      src: '/images/chinh-sach/van-chuyen.jpg',
      alt: 'Nhân viên giao hàng vận chuyển nội thất đến tận nhà khách hàng',
    },
    sections: [
      {
        heading: 'Phạm vi và cách thức giao hàng',
        body: `${companyLine} Chúng tôi giao hàng trên toàn quốc. Đơn hàng tại TP. Hồ Chí Minh được giao bằng xe máy (hàng có kích thước nhỏ) hoặc xe ba gác/xe tải (hàng cồng kềnh); đơn hàng ngoài TP. Hồ Chí Minh được vận chuyển qua ViettelPost. Phí vận chuyển phụ thuộc vào khu vực giao hàng và loại hàng hóa, và được báo chính xác khi xác nhận đơn hàng.`,
      },
      {
        heading: 'Phân chia khu vực tại TP. Hồ Chí Minh',
        blocks: [
          {
            type: 'ul',
            items: [
              'Nội thành: Quận 1, Quận 3, Quận 4, Quận 5, Quận 6, Quận 8, Quận 10, Tân Bình, Tân Phú, Bình Tân, Phú Nhuận, Bình Thạnh, Gò Vấp.',
              'Ngoại thành 1: Quận 2, Quận 7, Quận 12.',
              'Ngoại thành 2: Thủ Đức, Quận 9, Bình Chánh, Hóc Môn, Nhà Bè.',
              'Khu vực khác (gồm huyện Cần Giờ, huyện Củ Chi và các tỉnh/thành ngoài TP. Hồ Chí Minh): xem mục "Đơn hàng ngoại tỉnh" bên dưới.',
            ],
          },
        ],
      },
      {
        heading: 'Hàng giao bằng xe máy',
        blocks: [
          { type: 'p', text: 'Bảng phí vận chuyển và lắp ráp áp dụng cho sản phẩm có kích thước nhỏ hơn 140 × 70 cm.' },
          {
            type: 'table',
            head: ['Khu vực', 'Đơn hàng dưới 1.000.000đ', 'Đơn hàng trên 1.000.000đ'],
            rows: [
              ['Nội thành', '50.000đ / 1 sản phẩm', 'Miễn phí'],
              ['Ngoại thành 1', '50.000đ / 1 sản phẩm', '50.000đ / 1 sản phẩm'],
              ['Ngoại thành 2', '100.000đ / 1 sản phẩm', '100.000đ / 1 sản phẩm'],
            ],
          },
        ],
      },
      {
        heading: 'Hàng cồng kềnh (xe ba gác, xe tải)',
        blocks: [
          { type: 'p', text: 'Bảng phí vận chuyển và lắp ráp hàng cồng kềnh giao bằng xe ba gác hoặc xe tải. Một số đơn hàng có thể được miễn phí tùy giá trị đơn — vui lòng liên hệ để biết thêm chi tiết.' },
          {
            type: 'table',
            head: ['Khu vực', 'Phí vận chuyển và lắp ráp'],
            rows: [
              ['Nội thành', '200.000đ / 1 đơn hàng'],
              ['Ngoại thành 1', '300.000đ / 1 đơn hàng'],
              ['Ngoại thành 2', '400.000đ / 1 đơn hàng'],
            ],
          },
        ],
      },
      {
        heading: 'Đơn hàng ngoại tỉnh, huyện Cần Giờ, huyện Củ Chi',
        blocks: [
          {
            type: 'ul',
            items: [
              'Đơn hàng được vận chuyển bằng ViettelPost.',
              'Phí vận chuyển từ 150.000đ đến 500.000đ cho mỗi sản phẩm; phí được báo chính xác sau khi xác nhận đơn hàng.',
              'Thời gian nhận hàng khoảng 3 – 7 ngày, tùy sản phẩm và khu vực.',
              'Chúng tôi cung cấp mã vận đơn để khách hàng tự kiểm tra tình trạng đơn hàng.',
            ],
          },
        ],
      },
      {
        heading: 'Thời gian xác nhận đơn hàng',
        blocks: [
          {
            type: 'ul',
            items: [
              'Đơn hàng đặt trong giờ hành chính (9h – 18h): được gọi điện xác nhận trong vòng 30 phút đến 1 giờ.',
              'Đơn hàng đặt ngoài giờ hành chính (sau 18h): được xử lý vào ngày làm việc hôm sau.',
              'Đơn hàng đặt vào Chủ nhật: được xử lý vào thứ Hai của tuần kế tiếp.',
            ],
          },
        ],
      },
      {
        heading: 'Thời gian giao hàng',
        body: `Thời gian giao hàng chính xác sẽ được thông báo khi chúng tôi gọi điện xác nhận đơn hàng. Đối với đơn hàng cần giao hỏa tốc hoặc các yêu cầu đặc biệt khác, quý khách vui lòng liên hệ Hotline ${config.hotlineDisplay} để được tư vấn cụ thể.`,
      },
    ],
  },
  {
    slug: 'bao-hanh',
    title: 'Chính sách bảo hành',
    updatedAt: 'Cập nhật lần cuối: 2026',
    description: `Chính sách bảo hành sản phẩm của ${config.shopName}: thời hạn, điều kiện bảo hành theo nhóm sản phẩm và quy trình yêu cầu bảo hành.`,
    image: {
      src: '/images/chinh-sach/bao-hanh.jpg',
      alt: 'Kỹ thuật viên kiểm tra và bảo hành sản phẩm nội thất gỗ',
    },
    sections: [
      {
        heading: 'Lưu ý khi nhận hàng',
        body: 'Đề nghị quý khách kiểm tra hàng trước khi thanh toán. Quý khách không được trả lại hàng nếu không thuộc trường hợp đổi mới nêu tại Chính sách đổi trả.',
      },
      {
        heading: 'A. Thời hạn bảo hành',
        blocks: [
          {
            type: 'ul',
            items: [
              `Toàn bộ sản phẩm do ${config.shopName} sản xuất và cung cấp được bảo hành miễn phí kể từ ngày giao hàng và lắp đặt hoàn thiện. Thời hạn bảo hành cụ thể (12, 24 hoặc 36 tháng tùy dòng sản phẩm) được ghi tại mục "Bảo hành" trên trang chi tiết của từng sản phẩm.`,
              'Đổi mới sản phẩm trong vòng 7 ngày nếu phát sinh lỗi từ nhà sản xuất (chỉ áp dụng đối với sản phẩm có sẵn, không áp dụng đối với sản phẩm đặt theo thiết kế và yêu cầu riêng).',
            ],
          },
        ],
      },
      {
        heading: 'B. Điều kiện bảo hành theo nhóm sản phẩm',
        blocks: [
          { type: 'h3', text: '1. Ghế văn phòng / ghế cafe / ghế ăn' },
          { type: 'p', text: 'Sản phẩm được bảo hành miễn phí:' },
          {
            type: 'ul',
            items: [
              'Sản phẩm lỗi từ nhà sản xuất trong quá trình sản xuất hoặc vận chuyển.',
              'Khung chân, khung lưng sắt bị gãy hoặc mối hàn bị nứt.',
              'Chân nhựa được bảo hành 1 năm, thay mới trong trường hợp bị gãy.',
            ],
          },
          { type: 'p', text: 'Sản phẩm không được bảo hành miễn phí:' },
          {
            type: 'ul',
            items: [
              'Sản phẩm đã quá thời hạn bảo hành.',
              'Gãy ván trong quá trình sử dụng.',
              'Hư hỏng do tác động từ bên ngoài: rơi, va đập, trầy xước, hỏa hoạn...',
              'Khung chân hoặc khung lưng bị tróc sơn trong quá trình sử dụng.',
              'Phần vải, da, simili bọc ghế bị rách trong quá trình sử dụng.',
              'Tay ghế, chân ghế bị trầy xước trong quá trình sử dụng.',
              'Phần nệm mút bị xẹp trong quá trình sử dụng.',
            ],
          },
          { type: 'h3', text: '2. Bàn, tủ văn phòng / tủ kệ sắt gỗ' },
          { type: 'p', text: 'Sản phẩm được bảo hành miễn phí:' },
          {
            type: 'ul',
            items: [
              'Sản phẩm lỗi từ nhà sản xuất trong quá trình sản xuất hoặc vận chuyển.',
              'Mặt bàn bị trầy xước, cong vênh nghiêm trọng.',
            ],
          },
          { type: 'p', text: 'Sản phẩm không được bảo hành miễn phí:' },
          {
            type: 'ul',
            items: [
              `Sản phẩm/linh kiện không phải do ${config.shopName} sản xuất, nhập khẩu và phân phối.`,
              'Sản phẩm hao mòn tự nhiên do sử dụng lâu dài, hoặc do thường xuyên tiếp xúc với ánh nắng mặt trời, mưa bão, ẩm mốc...',
              'Sản phẩm bị tự ý thay đổi, sửa chữa từ phía khách hàng mà không do nhân viên kỹ thuật của chúng tôi hướng dẫn.',
              'Sản phẩm bị hư hỏng do bất cẩn trong quá trình tháo lắp, vận chuyển, va đập...',
            ],
          },
        ],
      },
      {
        heading: 'Nguyên tắc chung',
        blocks: [
          {
            type: 'ul',
            items: [
              'Để đảm bảo quyền lợi của khách hàng, chúng tôi sẽ xem xét các trường hợp cụ thể với điều kiện bảo hành phù hợp (bao gồm các nhóm sản phẩm khác ngoài hai nhóm nêu trên).',
              'Sản phẩm nằm trong điều kiện bảo hành sẽ được sửa chữa hoặc thay thế đối với phần hư hỏng, lỗi sản xuất.',
              'Trường hợp sản phẩm bị hư hỏng, mất mát trong quá trình sử dụng, chúng tôi sẽ hỗ trợ cung cấp các chi tiết, linh kiện tương tự để thay thế và có chức năng tương đương.',
            ],
          },
        ],
      },
      {
        heading: 'C. Địa điểm, thời gian và quy trình bảo hành',
        blocks: [
          {
            type: 'ul',
            items: [
              `Để yêu cầu bảo hành, quý khách vui lòng cung cấp đầy đủ thông tin và hình ảnh tình trạng hàng hóa qua Zalo/Messenger của ${config.shopName}, Email ${siteContent.companyInfo.email} hoặc Hotline ${config.hotlineDisplay}. Nhân viên chăm sóc khách hàng sẽ gọi lại trong thời gian sớm nhất.`,
              `Đối với đơn hàng lẻ, số lượng từ 1 đến 5 sản phẩm: bảo hành trực tiếp tại địa chỉ ${siteContent.companyInfo.address}. Quý khách vui lòng mang sản phẩm đến để được nhân viên kỹ thuật sửa chữa miễn phí.`,
              'Thời gian bảo hành: trong giờ làm việc 8h30 – 18h, từ Thứ Hai đến Thứ Bảy.',
              'Chúng tôi phản hồi đã tiếp nhận yêu cầu bảo hành trong vòng 3 giờ làm việc; thời gian tiến hành bảo hành từ 3 – 7 ngày làm việc.',
            ],
          },
        ],
      },
    ],
  },
];