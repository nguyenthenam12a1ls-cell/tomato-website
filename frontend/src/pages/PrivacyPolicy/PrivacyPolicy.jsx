import React from 'react';

const PrivacyPolicy = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 mt-20">
      <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
        <div className="mb-10 text-center">
            <h1 className="font-headline-lg text-[36px] font-bold text-primary mb-4">Chính sách pháp lý & Bảo mật</h1>
            <p className="text-on-surface-variant italic">Cập nhật lần cuối: 14/11/2025</p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
        </div>

        <div className="prose prose-lg max-w-none text-on-surface leading-relaxed space-y-8">
            <p className="text-[18px]">Cảm ơn bạn đã tin tưởng <strong className="text-primary">Tomato</strong>. Bảo vệ dữ liệu cá nhân của bạn là ưu tiên hàng đầu của chúng tôi. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">1. Thông tin chúng tôi thu thập</h3>
                <p className="mb-4">Chúng tôi thu thập các thông tin cần thiết để xử lý đơn hàng của bạn, bao gồm:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                        <strong className="text-primary flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[18px]">badge</span>Thông tin định danh:</strong>
                        <p className="text-sm">Tên, email, số điện thoại.</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                        <strong className="text-primary flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[18px]">location_on</span>Thông tin giao hàng:</strong>
                        <p className="text-sm">Địa chỉ (Tỉnh/Thành, Xã/Phường, số nhà).</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                        <strong className="text-primary flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[18px]">devices</span>Thông tin kỹ thuật:</strong>
                        <p className="text-sm">Địa chỉ IP, loại trình duyệt, lịch sử truy cập (để cải thiện trải nghiệm).</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                        <strong className="text-primary flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[18px]">credit_card</span>Thông tin thanh toán:</strong>
                        <p className="text-sm">Chúng tôi không lưu trữ thông tin thẻ. Xử lý trực tiếp bởi Stripe (PCI-DSS).</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">2. Chúng tôi sử dụng thông tin của bạn như thế nào?</h3>
                <ul className="space-y-3 list-disc pl-6 bg-surface p-6 rounded-xl border border-outline-variant/50">
                    <li>Để xử lý, xác nhận và giao đơn hàng của bạn.</li>
                    <li>Để gửi thông báo về trạng thái đơn hàng (qua email hoặc thông báo đẩy).</li>
                    <li>Để xác thực tài khoản của bạn (qua Google Auth hoặc email).</li>
                    <li>Để gửi các thông báo khuyến mãi và bản tin (chỉ khi bạn đồng ý nhận tin).</li>
                    <li>Để cá nhân hóa trải nghiệm, đề xuất món ăn phù hợp.</li>
                    <li>Để cải thiện dịch vụ, bảo trì hệ thống và ngăn chặn gian lận.</li>
                </ul>
            </section>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">3. Bảo mật và chia sẻ thông tin</h3>
                <div className="bg-primary-container/10 p-4 rounded-xl border border-primary-container/30 mb-4">
                    <p>Chúng tôi cam kết <strong className="text-primary">không bán, cho thuê hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.</p>
                </div>
                <p className="mb-2">Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:</p>
                <ul className="space-y-2 list-inside list-disc pl-4 mb-4">
                    <li><strong>Cho tài xế:</strong> Cung cấp tên, SĐT và địa chỉ để thực hiện việc giao hàng.</li>
                    <li><strong>Cho đối tác thanh toán:</strong> Để xử lý giao dịch của bạn.</li>
                    <li><strong>Theo yêu cầu pháp lý:</strong> Khi có yêu cầu hợp lệ từ cơ quan nhà nước có thẩm quyền.</li>
                </ul>
                <p className="text-sm italic text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">lock</span>
                    Dữ liệu của bạn được mã hóa (SSL/TLS) khi truyền tải và được lưu trữ trên các máy chủ bảo mật, có tường lửa bảo vệ.
                </p>
            </section>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">4. Quyền của bạn</h3>
                <p>Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất cứ lúc nào thông qua trang "Hồ sơ" (Profile) sau khi đăng nhập, hoặc bằng cách liên hệ với bộ phận hỗ trợ của chúng tôi qua email: <a href="mailto:contact@tomato.com" className="text-primary font-bold hover:underline">contact@tomato.com</a>.</p>
            </section>

            <section>
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">5. Thay đổi chính sách</h3>
                <p>Chúng tôi có thể cập nhật chính sách này theo thời gian để phản ánh các thay đổi trong dịch vụ hoặc luật pháp. Mọi thay đổi lớn sẽ được thông báo qua email hoặc thông báo nổi bật trên trang web. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
            </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;