import React from 'react';

const AboutUs = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 mt-20">
      <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
        <div className="mb-10 text-center">
            <h1 className="font-headline-lg text-[36px] font-bold text-primary mb-4">Về Chúng Tôi</h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="prose prose-lg max-w-none text-on-surface leading-relaxed space-y-6">
            <p className="text-[18px]">Chào mừng bạn đến với <strong className="text-primary">Tomato</strong>! Chúng tôi không chỉ là một dịch vụ giao đồ ăn, chúng tôi là cầu nối mang đến những trải nghiệm ẩm thực chất lượng cao, tiện lợi và đáng tin cậy ngay tại ngưỡng cửa nhà bạn. Được thành lập với niềm đam mê ẩm thực và công nghệ, Tomato cam kết định nghĩa lại cách bạn thưởng thức các bữa ăn hàng ngày.</p>
            
            <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary my-8">
                <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-3">Sứ mệnh của chúng tôi</h3>
                <p>Sứ mệnh của Tomato là <strong className="italic">"Kết nối hương vị, trọn vẹn cuộc sống"</strong>. Chúng tôi nỗ lực mỗi ngày để tuyển chọn những nhà hàng tốt nhất, đảm bảo chất lượng từng món ăn và tối ưu hóa quy trình vận hành để mang đến cho bạn những bữa ăn nóng hổi, thơm ngon chỉ trong vài cú nhấp chuột.</p>
            </div>

            <h3 className="font-headline-md text-[24px] font-bold text-on-surface mt-8 mb-4">Giá trị cốt lõi</h3>
            <ul className="space-y-4 list-disc pl-6">
                <li><strong className="text-primary">Chất lượng là ưu tiên số 1:</strong> Chúng tôi hợp tác độc quyền với các đối tác nhà hàng uy tín, tuân thủ nghiêm ngặt các tiêu chuẩn vệ sinh an toàn thực phẩm.</li>
                <li><strong className="text-primary">Khách hàng là trọng tâm:</strong> Mọi quyết định của chúng tôi đều bắt đầu và kết thúc bằng lợi ích của bạn. Đội ngũ hỗ trợ luôn sẵn sàng 24/7.</li>
                <li><strong className="text-primary">Công nghệ vì sự tiện lợi:</strong> Giao diện đặt hàng thông minh, theo dõi đơn hàng thời gian thực và thanh toán an toàn.</li>
                <li><strong className="text-primary">Minh bạch:</strong> Không có chi phí ẩn. Mọi thông tin về giá cả, phí vận chuyển và thời gian dự kiến đều được hiển thị rõ ràng.</li>
            </ul>

            <h3 className="font-headline-md text-[24px] font-bold text-on-surface mt-10 mb-4">Tầm nhìn</h3>
            <p>Đến năm 2030, Tomato đặt mục tiêu trở thành nền tảng ẩm thực hàng đầu tại Việt Nam, không chỉ là một ứng dụng giao đồ ăn mà còn là người bạn đồng hành đáng tin cậy trong mọi bữa ăn của gia đình Việt.</p>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;