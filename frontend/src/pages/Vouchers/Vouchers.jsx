import React from 'react';
import { useNavigate } from 'react-router-dom';

const Vouchers = () => {
    const navigate = useNavigate();

    return (
        <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg space-y-stack-xl mt-20">
            {/* 1. Hero Deals Carousel */}
            <section className="relative group mt-4 cursor-pointer" onClick={() => navigate('/restaurants')}>
                <div className="relative aspect-[21/9] md:aspect-[16/6] rounded-xl overflow-hidden shadow-lg bg-surface-container">
                    <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGsBJaZ4ZMuNSjwiR4ghYA4hsDDRgsniC_U77VOvOjDTOaYhEy-knjMvgSqDpVFoNW7jSChJIJq3T6TCQjUNCLN35aEYm44xt9IACYRRv-0y1m5CWijSaquyOklQzPsWHKcrcmNQE92wgK7LQWi87v1xCnijDBCMDqaDewpwcQ7PgnIx56WKstTX9A_2t2Pt4W7abbh-YMROHuKYcjseoVjg6SuYI5-jSiVGnx0Pw1WGye_fujnAM')"}}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-stack-xl">
                        <span className="bg-primary text-white text-label-sm px-3 py-1 rounded-full w-fit mb-stack-sm font-bold">DEAL TUẦN NÀY</span>
                        <h2 className="text-white text-[24px] md:text-display-lg max-w-lg mb-stack-md font-bold leading-tight">Tiệc Sang Giá Xịn<br/><span className="text-secondary-fixed">Giảm Đến 50%</span></h2>
                        <div className="flex items-center gap-stack-md text-white">
                            <span className="font-label-md uppercase tracking-wider opacity-80 font-bold">Kết thúc sau:</span>
                            <div className="flex gap-2">
                                <span className="font-mono text-headline-md font-bold text-primary-fixed" id="hero-timer">02:14:33</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promo Code Input */}
            <section className="bg-surface-container-high p-6 md:p-stack-lg rounded-xl flex flex-col md:flex-row items-center justify-between gap-stack-md shadow-sm">
                <div className="flex items-center gap-stack-md w-full md:w-auto">
                    <span className="material-symbols-outlined text-primary text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>confirmation_number</span>
                    <div>
                        <h3 className="font-headline-md text-on-surface font-bold">Bạn có mã ưu đãi?</h3>
                        <p className="text-body-md text-on-surface-variant">Nhập mã để nhận ngay giảm giá hời</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-[400px] gap-stack-sm">
                    <input className="flex-1 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 bg-surface-container-lowest text-body-md uppercase font-bold tracking-widest" placeholder="Ví dụ: TOMATO2024" type="text"/>
                    <button className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:bg-primary-container transition-colors shadow-sm">Áp dụng</button>
                </div>
            </section>

            {/* Voucher Section */}
            <section className="space-y-stack-lg">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
                    <div>
                        <h2 className="text-[24px] md:text-headline-lg font-bold text-on-surface">Ưu đãi dành cho bạn</h2>
                        <p className="text-body-md text-on-surface-variant">Lưu voucher ngay để đặt món với giá tốt nhất</p>
                    </div>
                    <div className="flex bg-surface-container-low p-1 rounded-xl w-fit border border-outline-variant/30">
                        <button className="px-6 py-2 rounded-lg font-bold bg-surface-container-lowest shadow-sm text-primary">Tất cả voucher</button>
                        <button className="px-6 py-2 rounded-lg font-bold text-on-surface-variant hover:text-on-surface">Của tôi (12)</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-gutter">
                    {/* Voucher Card 1 */}
                    <div className="bg-surface-container-lowest p-6 flex flex-col sm:flex-row gap-4 sm:gap-stack-lg items-center relative shadow-sm border border-outline-variant hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                        <div className="absolute left-[-10px] top-[50%] translate-y-[-50%] w-[20px] h-[20px] bg-background rounded-full border-r border-outline-variant hidden sm:block"></div>
                        <div className="absolute right-[-10px] top-[50%] translate-y-[-50%] w-[20px] h-[20px] bg-background rounded-full border-l border-outline-variant hidden sm:block"></div>
                        
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-container flex-shrink-0 mx-auto sm:mx-0">
                            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOkye2F78MOe_9XxORfhH435g_CVYW0HJ7H9hIJS7FKLd33sKY6znIs-sVQ6P4XlE8wvFxtDN-dWG3_djxwr0uM4gPVp4_glnfocpAM_Fuu05WIKjjo6hN-85m6n8TRcFfpNXSSxg2Zun_9MK39u8xTJxaeY4BRwIsdiR0xVAeFPbRreIRieKgkdj_axMJYL-xdpMojljUeX7Ize7fEdRDN3V4LcwwvJ4qq1IiXFiz_S-fcSnyGWw')"}}></div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-headline-md text-primary font-bold text-[20px]">Giảm 30k</h4>
                                    <p className="font-label-md text-on-surface font-bold">Pizza 4P's - Toàn hệ thống</p>
                                </div>
                                <span className="text-[10px] bg-surface-container-low text-secondary px-2 py-1 rounded border border-secondary/20 font-bold whitespace-nowrap">SẮP HẾT HẠN</span>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-label-sm text-on-surface-variant font-bold">
                                    <span>Đơn tối thiểu 200k</span>
                                    <span>HSD: 24/12/2024</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{width: '75%'}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-outline-variant w-full sm:w-auto h-0 sm:h-24 sm:ml-2 my-2 sm:my-0"></div>
                        <button onClick={() => navigate('/restaurants')} className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold h-fit hover:bg-primary-container transition-colors w-full sm:w-auto">Dùng ngay</button>
                    </div>

                    {/* Voucher Card 2 */}
                    <div className="bg-surface-container-lowest p-6 flex flex-col sm:flex-row gap-4 sm:gap-stack-lg items-center relative shadow-sm border border-outline-variant hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                        <div className="absolute left-[-10px] top-[50%] translate-y-[-50%] w-[20px] h-[20px] bg-background rounded-full border-r border-outline-variant hidden sm:block"></div>
                        <div className="absolute right-[-10px] top-[50%] translate-y-[-50%] w-[20px] h-[20px] bg-background rounded-full border-l border-outline-variant hidden sm:block"></div>

                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-container flex-shrink-0 mx-auto sm:mx-0">
                            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALSOXnHMZFhITneZibHnQ6h5sFLbvNpHHwRsMu8EqxCDwqDJtPpRxgTXdYxYgwUE5yd1dZYEtl78YqFx7FM9q7ilc08mLC1_PSWk8rc7FAkghYtZsLG276cKY1beKD8swQRgKkY8KBfMQFQy47m2vB0yCuOKCaG0r1BrEF7rkOocI3sMWFhBnBfi5Equ4Or8Vp5Lu3A6MnjEl7GJDXkAq7V_xfkABRI_-i18pTfmVVvvia4br7j1o')"}}></div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-headline-md text-primary font-bold text-[20px]">Freeship 15k</h4>
                                    <p className="font-label-md text-on-surface font-bold">Hokkaido Sachi - Delivery Only</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-label-sm text-on-surface-variant font-bold">
                                    <span>Đơn tối thiểu 150k</span>
                                    <span>HSD: 30/12/2024</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{width: '30%'}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-outline-variant w-full sm:w-auto h-0 sm:h-24 sm:ml-2 my-2 sm:my-0"></div>
                        <button onClick={() => navigate('/restaurants')} className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold h-fit hover:bg-primary-container transition-colors w-full sm:w-auto">Dùng ngay</button>
                    </div>
                </div>
            </section>

            {/* Loyalty Program Section */}
            <section className="bg-on-surface text-on-tertiary p-6 md:p-stack-lg rounded-xl overflow-hidden relative shadow-lg mt-8">
                <div className="absolute top-0 right-0 p-stack-lg flex flex-col items-end opacity-10">
                    <span className="material-symbols-outlined text-[120px]" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                </div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-stack-xl items-center">
                    <div className="space-y-stack-md">
                        <div className="flex items-center gap-stack-sm">
                            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                            <h3 className="text-headline-md font-bold text-white uppercase tracking-wider text-[20px]">Hội viên Tomato Rewards</h3>
                        </div>
                        <p className="text-body-md opacity-80">Tích lũy điểm để nhận ưu đãi đặc quyền và Voucher giảm giá mỗi ngày.</p>
                        <div className="mt-stack-lg">
                            <div className="flex justify-between font-label-md mb-2 font-bold">
                                <span>Thành viên Bạc</span>
                                <span>1,250 / 2,500 Điểm</span>
                            </div>
                            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/20 p-[2px]">
                                <div className="bg-gradient-to-r from-secondary-container to-primary h-full rounded-full" style={{width: '50%'}}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-8">
                            <div className="flex flex-col items-center opacity-60">
                                <span className="text-2xl mb-1">🥉</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Đồng</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">🥈</span>
                                <span className="text-[10px] font-bold uppercase text-white">Bạc</span>
                            </div>
                            <div className="flex flex-col items-center opacity-40">
                                <span className="text-2xl mb-1">🥇</span>
                                <span className="text-[10px] font-bold uppercase">Vàng</span>
                            </div>
                            <div className="flex flex-col items-center opacity-40">
                                <span className="text-2xl mb-1">💎</span>
                                <span className="text-[10px] font-bold uppercase">K.Cương</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <h4 className="font-label-md mb-4 border-b border-white/10 pb-2 font-bold uppercase tracking-wider">Đặc quyền hạng Bạc:</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-body-md">
                                <span className="material-symbols-outlined text-secondary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                Tích 2% điểm trên mỗi đơn hàng
                            </li>
                            <li className="flex items-center gap-3 text-body-md">
                                <span className="material-symbols-outlined text-secondary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                Voucher sinh nhật giảm 100k
                            </li>
                            <li className="flex items-center gap-3 text-body-md opacity-50">
                                <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
                                Freeship đơn hàng trên 300k (Hạng Vàng)
                            </li>
                        </ul>
                        <button className="w-full mt-8 bg-white text-on-surface font-bold py-3 rounded-xl hover:bg-surface-container transition-colors">Xem chi tiết ưu đãi</button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Vouchers;
