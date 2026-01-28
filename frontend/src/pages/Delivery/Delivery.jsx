import React from 'react';
import '../StaticPage.css'; // Sử dụng CSS chung

const Delivery = () => {
  return (
    <div className="static-page">
      <h2>Chính sách Vận chuyển</h2>
      <p>Tại Tomato, chúng tôi hiểu rằng một món ăn ngon chỉ trọn vẹn khi được giao đến tay bạn một cách nhanh chóng và hoàn hảo. Dưới đây là các cam kết về dịch vụ vận chuyển của chúng tôi.</p>

      <h3>1. Phạm vi giao hàng</h3>
      <p>Hiện tại, chúng tôi phục vụ giao hàng tại các khu vực sau:</p>
      <ul>
        <li><strong>Nội thành (Các quận trung tâm):</strong> Giao hàng nhanh trong 30-45 phút.</li>
        <li><strong>Ngoại thành (Các huyện/khu vực lân cận):</strong> Giao hàng trong 60-90 phút. Chúng tôi đang không ngừng mở rộng mạng lưới.</li>
      </ul>
      
      <h3>2. Biểu phí vận chuyển</h3>
      <ul>
        <li><strong>Đơn hàng trên 200.000 VNĐ:</strong> Miễn phí vận chuyển (Freeship) trong phạm vi nội thành.</li>
        <li><strong>Đơn hàng dưới 200.000 VNĐ:</strong> Áp dụng phí vận chuyển đồng giá 15.000 VNĐ cho khu vực nội thành.</li>
        <li><strong>Khu vực ngoại thành:</strong> Phí vận chuyển sẽ được tính tự động dựa trên khoảng cách (từ 25.000 VNĐ - 40.000 VNĐ) và sẽ được hiển thị rõ ràng trước khi bạn xác nhận đơn hàng.</li>
      </ul>

      <h3>3. Quy trình xử lý và giao hàng</h3>
      <p><strong>Bước 1: Xác nhận đơn:</strong> Ngay khi bạn đặt hàng, hệ thống sẽ gửi đơn đến nhà hàng. Nhà hàng sẽ xác nhận đơn trong vòng 2-5 phút.</p>
      <p><strong>Bước 2: Chuẩn bị món:</strong> Nhà hàng bắt đầu chế biến món ăn (15-20 phút).</p>
      <p><strong>Bước 3: Tài xế nhận đơn:</strong> Hệ thống tự động điều phối tài xế gần nhất đến nhận món ăn.</p>
      <p><strong>Bước 4: Giao hàng:</strong> Bạn có thể theo dõi hành trình của tài xế qua thời gian thực trên ứng dụng (nếu có). Tài xế sẽ gọi cho bạn khi đến nơi.</p>
      
      <h3>4. Hủy đơn hàng</h3>
      <p>Bạn có thể hủy đơn hàng miễn phí trong vòng 5 phút sau khi đặt. Sau thời gian này, nếu nhà hàng đã bắt đầu chuẩn bị món, một khoản phí nhỏ (tùy theo giá trị đơn hàng) có thể được áp dụng.</p>
    </div>
  );
};

export default Delivery;