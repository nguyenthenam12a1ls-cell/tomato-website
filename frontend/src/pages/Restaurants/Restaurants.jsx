import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const mockRestaurants = [
    {
        id: "1",
        name: "The Grill - Beefsteak & Pasta",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtRqGZoaDk6PbZeQr1iG0K0zBvqTAzuWtcC54XVKJO6oEOHtRLOEkU55RWZlCnqbpbVq42xTJ4tufFMHWGtr_w74ic8iMxsJxxCm3bLmRAb6dS3hCoYysbo4XzN6j0ZaslYMBvIdGP4_isc97-n1Sh3xhmv5Iz7GRYOBpH9eF07wiWJLlxrb-Jxv6ik9uBZweRj_SMslg6x3NS7n6v_UxdKadTfOJS1Ud3Beui7ykLR6QL-T7PSiw",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-rIW205K7s9O6JhEO5P-BTutuARizvYVQ_I9PAR4mmZ5ZT8CRaUSESJuI7BklCS-etogSNQnyabezFmoHfaDAMNBlRUBnIH64xOsbK-9S1FY9KSIlc4uufA43NaPJIHr74_1_Dp83LciEeMAWYon5CiSyiP1kURO2ae3lIyTip8Vexdj1o82mm9-A10kimNGlkjBp-_0JWukz6RMte0EAIY549hWm_YgNqWYp-KcrWlYrPqzNMWo",
        rating: "4.9",
        time: "25-30'",
        tags: ["Beefsteak", "Âu"],
        categoryMapping: "Pasta",
        description: "Món Ý · Pasta · Hải sản · Fine Dining",
        address: "123 Lê Lợi, Quận 1, TP. HCM",
        ship: "15k ship",
        hours: "07:00-22:00"
    },
    {
        id: "2",
        name: "Green Life - Healthy Food",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKZgIsvbFazZE6fpB1GbBdRSSlXFHYjhd3qybMd69XbWFLjXzCp8ccdWeSypqqnJuqHyIy0sxYV4JvIhDxl7WTTLy-xJqwCW5M6t_1VYPZYXGxTx7Ekqywlfr0NajSGUDY_TpbBe9hSXvFeIztUaAjCqef5dskF0kUr1AHfBo9bG74DInOfNGHmMM6_K8cT_OchhUDxWghXPjq4K1oqyEfvCexEN2UFkTFoLAopzktrQQZ2HDGFAs",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoDYFU3S1rCnQhvV9iB2w9UlTP6DYYj93D86RnSg_fS-XklNbJAwmJT1vaY2jmNFVxWUewheivsAYcwIDJrNm9JDHoLCvC8_clNvGcICtwovwckmnZkuxXBxi-l6hPhDp55bieReyJVqFiE7NeZhsn0QRYr71Zv2DovAcigaND52l--trrmsQdKSjHWgGMuZgXtWeIUTLa79r7Nc9Oy-Kbw_lFYtxRxGCG7_2nY90b88CZ9TM4U9I",
        rating: "4.7",
        time: "20-25'",
        tags: ["Healthy", "Salad"],
        categoryMapping: "Salad",
        description: "Salad hữu cơ · Nước ép · Ăn kiêng",
        address: "45 Nguyễn Huệ, Quận 1, TP. HCM",
        ship: "Free ship",
        hours: "08:00-21:00"
    },
    {
        id: "3",
        name: "Bếp Bà Ba - Cơm Tấm",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9a1VqKlUkhIcEL2nuuSCtusqbWwP5k-5eh81wdZB94XQzZ1gpAsixXSi7ISlTK_fnpSf-0Zt6TgVUfF3TKYtK9zVgXDy15e4d8z2ItPvPy0bw_Edgn8WgN6Ij9ORjBfGmmcVqC2vL4DLJ_Ff7wcBDg5VAvm7LrqBWtRJHxE1WH2a0J7u1GX56cxCtmkkjlvi8VTihBwmhRqLlVEyaKfe3BUYEwMQjT8AK75JZJwuDmcWBCNnlaGU",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEwP3PIy9AtOhboiYgse91EiCaWhcsgPVLh66b30SvXM4HbOZvKoW0Lys_9C4S4Ynb1XpWHjiYeydihOCAfWiy-VIe2vH1HwrUY1PkMVZ5vpQ7gMHpICD0SVuJ3vKhi7j-IXt5wpVAOQ9cxXCKcizdh84iH5y4pqtDxTVpbVBPpY9fPnFPYrRx5x9Q3NY3xZTsBOiTyu1xEtDPMhfAapKAGVEbYWBzN3hjUQOcPQ9P-MI1iHEfHqE",
        rating: "4.8",
        time: "15-20'",
        tags: ["Cơm Tấm", "Bình dân"],
        categoryMapping: "Pure Veg",
        description: "Cơm tấm sườn bì chả · Ẩm thực Việt",
        address: "78 Võ Văn Tần, Quận 3, TP. HCM",
        ship: "12k ship",
        hours: "06:00-22:00"
    },
    {
        id: "4",
        name: "Kichi Kichi - Sushi Bar",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy4_lqRjDK6vblNY0ykyt4VgdjjZT-p_AkNQ8mSVLDZ7lMBSHbLfeAU7PlCUSXjOfXGruk14yiRBXFd0GYp-JYVk3a-FVcG5sxVe2AGn2AsNcrHXS5ccL7VU6AkDL9aml-X4u1sz3khE8XuU2hAcrIKuJHBV1_QD7GOiv0UbBQFs-_e64uEnRNh57bDKJm0e4YWDSPBBBRicIEqFOgx77FsxJEIKljHm6O-a-1uaZBBYhpK6bKZvA",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_2tR-mtKe7iW8DFqzbBeDz1D3L8v2RM0fkgb3ehSNhpK2iLtAxIp01CRtEAu5kMPjmlFr7qlCVxCFwKiqmPX_IXn-jK557n-2nnbXmKKMbLBjPS15G2gpCqd_X6VHazYnrYXvC5574FbW8Dx3gwur_dapAS8iqFLowQ-YWGj6Am5ARjAJuMNpJ4BkonukCRVxHCDSi5esfRk21jsVxjBzbbi3rFfni9UjPSL0w4VVu23bUiG0z4s",
        rating: "4.6",
        time: "30-40'",
        tags: ["Sushi", "Nhật"],
        categoryMapping: "Rolls",
        description: "Sushi · Sashimi · Lẩu băng chuyền Nhật Bản",
        address: "99 Cao Thắng, Quận 3, TP. HCM",
        ship: "20k ship",
        hours: "10:00-22:00"
    }
];

const Restaurants = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRestaurants = mockRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <main className="pt-28 pb-16 min-h-screen bg-background">
            <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
                
                {/* Header & Location */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-on-surface font-bold mb-2">Nhà hàng gần bạn</h1>
                        <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-1.5 w-fit cursor-pointer hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-primary text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                            <span className="font-label-md text-label-md text-sm">24 Lê Thánh Tôn, Quận 1, TP. HCM</span>
                            <span className="material-symbols-outlined text-xs">expand_more</span>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input 
                            className="bg-white text-on-surface pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant focus:outline-none focus:border-primary w-full text-sm" 
                            placeholder="Tìm kiếm nhà hàng..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid for Restaurants */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRestaurants.map((rest, index) => (
                        <div 
                            key={index} 
                            onClick={() => navigate(`/restaurant/${rest.id}`)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group cursor-pointer border border-outline-variant/30 flex flex-col"
                        >
                            <div className="h-36 relative overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={rest.image} alt={rest.name} />
                                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-label-sm font-bold shadow-sm backdrop-blur-sm bg-opacity-90 text-[11px]">Mở cửa</div>
                                <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-white shadow-md bg-white overflow-hidden z-10">
                                    <img className="w-full h-full object-cover" src={rest.logo} alt="Logo" />
                                </div>
                            </div>
                            <div className="pt-8 p-4 flex-grow flex flex-col">
                                <h3 className="text-label-md font-headline-md mb-1 line-clamp-1 text-[16px] font-bold group-hover:text-primary transition-colors">{rest.name}</h3>
                                <p className="text-on-surface-variant font-body-sm text-[12px] mb-2">{rest.description}</p>
                                <div className="flex items-center gap-4 text-on-surface-variant text-label-sm mb-3">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span> 
                                        <span className="font-bold text-on-surface">{rest.rating}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-[12px]">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span> 
                                        {rest.time}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {rest.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-surface-container-low text-on-surface px-2 py-1 rounded-lg text-label-sm border border-outline-variant/20 text-[11px]">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Restaurants;
