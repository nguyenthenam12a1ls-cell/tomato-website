import React, { useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import { assets } from '../../assets/assets'; // In case we need it

const Header = () => {
    const { setSearchTerm } = useContext(CartContext);

    return (
        <section className="w-full h-[520px] bg-gradient-to-r from-primary to-secondary-container flex items-center relative overflow-hidden mt-20 rounded-2xl md:rounded-none">
            <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop grid md:grid-cols-2 items-center w-full relative z-10">
                <div className="text-on-primary space-y-6">
                    <h1 className="text-[36px] md:text-display-lg font-display-lg font-extrabold leading-tight">Đồ ăn ngon, <br />giao tận nơi</h1>
                    <p className="text-body-lg font-body-lg opacity-90 max-w-md">Hàng trăm nhà hàng · Giao trong 30 phút · Tươi ngon đảm bảo</p>
                    <div className="flex bg-surface rounded-xl p-2 shadow-xl max-w-lg items-center">
                        <div className="flex-grow flex items-center px-4 gap-2">
                            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                            <input 
                                className="border-none bg-transparent focus:ring-0 text-on-surface w-full font-body-md outline-none" 
                                placeholder="Tìm món ăn yêu thích..." 
                                type="text"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <a href="#explore-menu" className="bg-primary text-on-primary px-4 md:px-8 py-3 rounded-xl font-label-md hover:opacity-90 transition-opacity active:scale-95 whitespace-nowrap">Khám phá</a>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                        <span className="flex items-center gap-1 bg-surface-container-lowest/20 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-semibold">⚡ Giao nhanh 30'</span>
                        <span className="flex items-center gap-1 bg-surface-container-lowest/20 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-semibold">⭐ 4.8/5</span>
                        <span className="flex items-center gap-1 bg-surface-container-lowest/20 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-semibold">🛡️ Đảm bảo chất lượng</span>
                    </div>
                </div>
                <div className="hidden md:flex justify-end relative h-full">
                    <div className="grid grid-cols-2 gap-4 rotate-3 scale-110">
                        <div className="rounded-2xl overflow-hidden shadow-2xl h-64 w-48 mt-12 hover:scale-105 transition-transform duration-500">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpGamlZDOy6hq1ed8UEcTaEOUi4kxyOkr7SePeAF_F6ib26W1bQHpTFQBJFBe8rMSBLfe8mebqNykeEaifllF3IggGkurtmHz66DXEgh4U_5tyXbcVTOGBKtKyafdjU0eNp9bTJNn8dSlPsNR6hYq1EBflDUByV4c_WWZZ1Z0ZfLpi1m77XdvedNqqxI-I4p6hrV0lQ8pC_nkN8qhClpULt95Cj9qcnR6INMsISR-3o_cMVTaM1fY" alt="Pho" />
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-2xl h-64 w-48 hover:scale-105 transition-transform duration-500">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhYg4xZkx5ofTfEoKoEFEQtWaZvzn-ANnW2l76nP4MeUDSzJvxt2C15iIU0HB8En3biXLKvrorUPWek8lGZjhXI66zIllBFZhLs3Wbcs8KxW1BQAha2oTnvgVgVhYb4guqCdrZmUcbJNwKPbvnT8TcXqbH6aHxH846EnyghUpGmr_p-lxftFFJPqz-FWAxVFYywWpMh1WSKHcLynNEnHuKUF0xNKtlOwBPx5pxmnrDXxK6K6vlTpM" alt="Pizza" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Atmospheric glow */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 blur-[100px] rounded-full translate-x-1/2 pointer-events-none"></div>
        </section>
    );
};

export default Header;