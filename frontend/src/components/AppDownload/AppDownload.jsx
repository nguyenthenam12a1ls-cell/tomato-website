import React from 'react';

const AppDownload = () => {
    return (
        <section className="w-full bg-[#1A1A2E] py-16 md:py-stack-xl mt-20 overflow-hidden rounded-3xl mx-auto max-w-container-max mb-10" id="app-download">
            <div className="px-6 md:px-margin-desktop grid md:grid-cols-2 items-center gap-10">
                <div className="text-white space-y-8 z-10 relative">
                    <h2 className="text-4xl md:text-display-lg font-display-lg font-bold leading-tight">Đặt đồ ăn dễ dàng hơn với ứng dụng Tomato</h2>
                    <p className="text-body-lg opacity-80 max-w-lg">Theo dõi đơn hàng thời gian thực, nhận thông báo khuyến mãi độc quyền và thanh toán không tiền mặt chỉ với một chạm.</p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-black border border-white/20 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-3xl">apps</span>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold opacity-60">Tải trên</p>
                                <p className="text-label-md font-bold">App Store</p>
                            </div>
                        </button>
                        <button className="bg-black border border-white/20 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-3xl">play_arrow</span>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold opacity-60">Tải trên</p>
                                <p className="text-label-md font-bold">Google Play</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="hidden md:flex justify-center relative">
                    <div className="w-[280px] h-[550px] bg-black rounded-[40px] border-[10px] border-gray-800 shadow-2xl relative overflow-hidden transform translate-y-12 rotate-6 z-10">
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPRNUgCdCovFm2HIoRKxpRQS7Yl1N5BAEGOAwB8tf-1CDAuc2jKKEiVlmXB4n16E6j4_83Mqsy-mZkMQfGeWzCKIwEEpc9ZhCOpOsozhw3gSi-c--3F5CFSH99U4ZacuSZ65Zf-LZovar28MOmJDqGIUaOgFCoxtZ16jxm52Zngk4YYdj5PSw8huuSWHJgau01KEZp3N9p90dI1ZNSXVzX24et8cBKbb-UZEqs7Lxxi_mqOpKqyXE" 
                            alt="Tomato App UI" 
                        />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/30 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/30 blur-[60px] rounded-full pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;