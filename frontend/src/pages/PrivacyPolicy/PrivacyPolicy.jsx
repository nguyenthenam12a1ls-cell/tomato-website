import React from 'react';
import '../StaticPage.css'; // Sử dụng CSS chung

const PrivacyPolicy = () => {
  return (
    <div className="static-page">
      <h2>Chính sách pháp lý & Bảo mật</h2>
      <p>Cập nhật lần cuối: 14/11/2025</p>
      <p>Cảm ơn bạn đã tin tưởng Tomato. Bảo vệ dữ liệu cá nhân của bạn là ưu tiên hàng đầu của chúng tôi. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

      <h3>1. Thông tin chúng tôi thu thập</h3>
      <p>Chúng tôi thu thập các thông tin cần thiết để xử lý đơn hàng của bạn, bao gồm:</p>
      <ul>
        <li><strong>Thông tin định danh:</strong> Tên, email, số điện thoại.</li>
        <li><strong>Thông tin giao hàng:</strong> Địa chỉ (Tỉnh/Thành, Xã/Phường, số nhà).</li>
        <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, lịch sử truy cập (để cải thiện trải nghiệm người dùng).</li>
        <li><strong>Thông tin thanh toán:</strong> Chúng tôi không lưu trữ thông tin thẻ của bạn. Thông tin này được xử lý trực tiếp bởi đối tác thanh toán (Stripe) tuân thủ PCI-DSS.</li>
      </ul>

      <h3>2. Chúng tôi sử dụng thông tin của bạn như thế nào?</h3>
      <ul>
        <li>Để xử lý, xác nhận và giao đơn hàng của bạn.</li>
        <li>Để gửi thông báo về trạng thái đơn hàng (qua email hoặc thông báo đẩy).</li>
        <li>Để xác thực tài khoản của bạn (qua Google Auth hoặc email).</li>
        <li>Để gửi các thông báo khuyến mãi và bản tin (chỉ khi bạn đồng ý nhận tin).</li>
        <li>Để cá nhân hóa trải nghiệm, đề xuất món ăn phù hợp.</li>
        <li>Để cải thiện dịch vụ, bảo trì hệ thống và ngăn chặn gian lận.</li>
      </ul>

      <h3>3. Bảo mật và chia sẻ thông tin</h3>
      <p>Chúng tôi cam kết <strong>không bán, cho thuê hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.</p>
      <p>Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:</p>
      <ul>
        <li><strong>Cho tài xế:</strong> Cung cấp tên, SĐT và địa chỉ để thực hiện việc giao hàng.</li>
        <li><strong>Cho đối tác thanh toán:</strong> Để xử lý giao dịch của bạn.</li>
        <li><strong>Theo yêu cầu pháp lý:</strong> Khi có yêu cầu hợp lệ từ cơ quan nhà nước có thẩm quyền.</li>
      </ul>
      <p>Dữ liệu của bạn được mã hóa (SSL/TLS) khi truyền tải và được lưu trữ trên các máy chủ bảo mật, có tường lửa bảo vệ.</p>

      <h3>4. Quyền của bạn</h3>
      <p>Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất cứ lúc nào thông qua trang "Hồ sơ" (Profile) sau khi đăng nhập, hoặc bằng cách liên hệ với bộ phận hỗ trợ của chúng tôi qua email: `contact@tomato.com`.</p>

      <h3>5. Thay đổi chính sách</h3>
      <p>Chúng tôi có thể cập nhật chính sách này theo thời gian để phản ánh các thay đổi trong dịch vụ hoặc luật pháp. Mọi thay đổi lớn sẽ được thông báo qua email hoặc thông báo nổi bật trên trang web. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
    </div>
  );
};

export default PrivacyPolicy;