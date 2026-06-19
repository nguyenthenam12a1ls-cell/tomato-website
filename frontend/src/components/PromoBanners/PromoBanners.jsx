import React from 'react';

const PromoBanners = () => {
    return (
        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg mb-8">
            <div className="grid md:grid-cols-2 gap-4 md:gap-gutter">
                <div className="h-48 rounded-2xl bg-green-600 overflow-hidden relative flex items-center p-6 md:p-8 group cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative z-10 text-white max-w-[70%]">
                        <h3 className="text-[20px] md:text-headline-md font-headline-md mb-2 font-bold leading-tight">Miễn phí giao hàng đơn đầu</h3>
                        <p className="text-label-md opacity-90 bg-black/20 inline-block px-3 py-1 rounded-full mt-2 font-mono">TRCHAOMUNG</p>
                    </div>
                    <div className="absolute right-[-20px] top-[-20px] opacity-20 transform scale-[2] md:scale-[2.5] group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px]" style={{fontVariationSettings: "'FILL' 1"}}>local_shipping</span>
                    </div>
                </div>
                
                <div className="h-48 rounded-2xl bg-secondary-container overflow-hidden relative flex items-center p-6 md:p-8 group cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative z-10 text-white max-w-[70%]">
                        <h3 className="text-[20px] md:text-headline-md font-headline-md mb-2 font-bold leading-tight">Tải app nhận ngay 50k</h3>
                        <p className="text-label-md opacity-90 mt-2">Áp dụng cho khách hàng mới</p>
                    </div>
                    <div className="absolute right-[-20px] top-[-20px] opacity-20 transform scale-[2] md:scale-[2.5] group-hover:-rotate-12 transition-transform duration-500 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px]" style={{fontVariationSettings: "'FILL' 1"}}>smartphone</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanners;
