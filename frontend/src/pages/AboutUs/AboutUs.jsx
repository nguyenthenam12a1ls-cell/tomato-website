import React from 'react';
import '../StaticPage.css'; // Sử dụng CSS chung

const AboutUs = () => {
  return (
    <div className="static-page">
      <h2>Về Chúng Tôi</h2>
      <p>Chào mừng bạn đến với Tomato! Chúng tôi không chỉ là một dịch vụ giao đồ ăn, chúng tôi là cầu nối mang đến những trải nghiệm ẩm thực chất lượng cao, tiện lợi và đáng tin cậy ngay tại ngưỡng cửa nhà bạn. Được thành lập với niềm đam mê ẩm thực và công nghệ, Tomato cam kết định nghĩa lại cách bạn thưởng thức các bữa ăn hàng ngày.</p>
      
      <h3>Sứ mệnh của chúng tôi</h3>
      <p>Sứ mệnh của Tomato là "Kết nối hương vị, trọn vẹn cuộc sống". Chúng tôi nỗ lực mỗi ngày để tuyển chọn những nhà hàng tốt nhất, đảm bảo chất lượng từng món ăn và tối ưu hóa quy trình vận hành để mang đến cho bạn những bữa ăn nóng hổi, thơm ngon chỉ trong vài cú nhấp chuột.</p>

      <h3>Giá trị cốt lõi</h3>
      <ul>
        <li><strong>Chất lượng là ưu tiên số 1:</strong> Chúng tôi hợp tác độc quyền với các đối tác nhà hàng uy tín, tuân thủ nghiêm ngặt các tiêu chuẩn vệ sinh an toàn thực phẩm.</li>
        <li><strong>Khách hàng là trọng tâm:</strong> Mọi quyết định của chúng tôi đều bắt đầu và kết thúc bằng lợi ích của bạn. Đội ngũ hỗ trợ luôn sẵn sàng 24/7.</li>
        <li><strong>Công nghệ vì sự tiện lợi:</strong> Giao diện đặt hàng thông minh, theo dõi đơn hàng thời gian thực và thanh toán an toàn.</li>
        <li><strong>Minh bạch:</strong> Không có chi phí ẩn. Mọi thông tin về giá cả, phí vận chuyển và thời gian dự kiến đều được hiển thị rõ ràng.</li>
      </ul>

      <h3>Tầm nhìn</h3>
      <p>Đến năm 2030, Tomato đặt mục tiêu trở thành nền tảng ẩm thực hàng đầu tại Việt Nam, không chỉ là một ứng dụng giao đồ ăn mà còn là người bạn đồng hành đáng tin cậy trong mọi bữa ăn của gia đình Việt.</p>
    </div>
  );
};

export default AboutUs;