import React from 'react';

const Delivery = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 mt-20">
      <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
        <div className="mb-10 text-center">
            <h1 className="font-headline-lg text-[36px] font-bold text-primary mb-4">Chính sách Vận chuyển</h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="prose prose-lg max-w-none text-on-surface leading-relaxed space-y-8">
            <p className="text-[18px]">Tại <strong className="text-primary">Tomato</strong>, chúng tôi hiểu rằng một món ăn ngon chỉ trọn vẹn khi được giao đến tay bạn một cách nhanh chóng và hoàn hảo. Dưới đây là các cam kết về dịch vụ vận chuyển của chúng tôi.</p>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm">1</span>
                    Phạm vi giao hàng
                </h3>
                <p className="mb-2">Hiện tại, chúng tôi phục vụ giao hàng tại các khu vực sau:</p>
                <ul className="space-y-2 list-disc pl-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                    <li><strong>Nội thành (Các quận trung tâm):</strong> Giao hàng nhanh trong 30-45 phút.</li>
                    <li><strong>Ngoại thành (Các huyện/khu vực lân cận):</strong> Giao hàng trong 60-90 phút. Chúng tôi đang không ngừng mở rộng mạng lưới.</li>
                </ul>
            </section>
            
            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm">2</span>
                    Biểu phí vận chuyển
                </h3>
                <ul className="space-y-4 pl-2">
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                        <div><strong>Đơn hàng trên 200.000 VNĐ:</strong> Miễn phí vận chuyển (Freeship) trong phạm vi nội thành.</div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary mt-1">local_shipping</span>
                        <div><strong>Đơn hàng dưới 200.000 VNĐ:</strong> Áp dụng phí vận chuyển đồng giá 15.000 VNĐ cho khu vực nội thành.</div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-orange-500 mt-1">map</span>
                        <div><strong>Khu vực ngoại thành:</strong> Phí vận chuyển sẽ được tính tự động dựa trên khoảng cách (từ 25.000 VNĐ - 40.000 VNĐ) và sẽ được hiển thị rõ ràng trước khi bạn xác nhận đơn hàng.</div>
                    </li>
                </ul>
            </section>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm">3</span>
                    Quy trình xử lý và giao hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 material-symbols-outlined text-[60px]">receipt_long</div>
                        <h4 className="font-bold text-primary mb-2">Bước 1: Xác nhận đơn</h4>
                        <p className="text-sm">Ngay khi bạn đặt hàng, hệ thống sẽ gửi đơn đến nhà hàng. Nhà hàng sẽ xác nhận đơn trong vòng 2-5 phút.</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 material-symbols-outlined text-[60px]">restaurant</div>
                        <h4 className="font-bold text-primary mb-2">Bước 2: Chuẩn bị món</h4>
                        <p className="text-sm">Nhà hàng bắt đầu chế biến món ăn (15-20 phút).</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 material-symbols-outlined text-[60px]">two_wheeler</div>
                        <h4 className="font-bold text-primary mb-2">Bước 3: Tài xế nhận đơn</h4>
                        <p className="text-sm">Hệ thống tự động điều phối tài xế gần nhất đến nhận món ăn.</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 material-symbols-outlined text-[60px]">home</div>
                        <h4 className="font-bold text-primary mb-2">Bước 4: Giao hàng</h4>
                        <p className="text-sm">Bạn có thể theo dõi hành trình của tài xế qua thời gian thực trên ứng dụng. Tài xế sẽ gọi cho bạn khi đến nơi.</p>
                    </div>
                </div>
            </section>
            
            <section className="bg-error/10 p-6 rounded-xl border border-error/20">
                <h3 className="font-headline-md text-[20px] font-bold text-error mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">cancel</span> Hủy đơn hàng
                </h3>
                <p className="text-on-surface">Bạn có thể hủy đơn hàng miễn phí trong vòng <strong>5 phút</strong> sau khi đặt. Sau thời gian này, nếu nhà hàng đã bắt đầu chuẩn bị món, một khoản phí nhỏ (tùy theo giá trị đơn hàng) có thể được áp dụng.</p>
            </section>
        </div>
      </div>
    </main>
  );
};

export default Delivery;