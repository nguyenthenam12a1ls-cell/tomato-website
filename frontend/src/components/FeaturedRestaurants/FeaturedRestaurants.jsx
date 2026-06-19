import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedRestaurants = () => {
    const navigate = useNavigate();
    const restaurants = [
        {
            id: "1",
            name: "The Grill - Beefsteak & Pasta",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtRqGZoaDk6PbZeQr1iG0K0zBvqTAzuWtcC54XVKJO6oEOHtRLOEkU55RWZlCnqbpbVq42xTJ4tufFMHWGtr_w74ic8iMxsJxxCm3bLmRAb6dS3hCoYysbo4XzN6j0ZaslYMBvIdGP4_isc97-n1Sh3xhmv5Iz7GRYOBpH9eF07wiWJLlxrb-Jxv6ik9uBZweRj_SMslg6x3NS7n6v_UxdKadTfOJS1Ud3Beui7ykLR6QL-T7PSiw",
            logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-rIW205K7s9O6JhEO5P-BTutuARizvYVQ_I9PAR4mmZ5ZT8CRaUSESJuI7BklCS-etogSNQnyabezFmoHfaDAMNBlRUBnIH64xOsbK-9S1FY9KSIlc4uufA43NaPJIHr74_1_Dp83LciEeMAWYon5CiSyiP1kURO2ae3lIyTip8Vexdj1o82mm9-A10kimNGlkjBp-_0JWukz6RMte0EAIY549hWm_YgNqWYp-KcrWlYrPqzNMWo",
            rating: "4.9",
            time: "25-30'",
            tags: ["Beefsteak", "Âu"],
            categoryMapping: "Pasta"
        },
        {
            id: "2",
            name: "Green Life - Healthy Food",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKZgIsvbFazZE6fpB1GbBdRSSlXFHYjhd3qybMd69XbWFLjXzCp8ccdWeSypqqnJuqHyIy0sxYV4JvIhDxl7WTTLy-xJqwCW5M6t_1VYPZYXGxTx7Ekqywlfr0NajSGUDY_TpbBe9hSXvFeIztUaAjCqef5dskF0kUr1AHfBo9bG74DInOfNGHmMM6_K8cT_OchhUDxWghXPjq4K1oqyEfvCexEN2UFkTFoLAopzktrQQZ2HDGFAs",
            logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoDYFU3S1rCnQhvV9iB2w9UlTP6DYYj93D86RnSg_fS-XklNbJAwmJT1vaY2jmNFVxWUewheivsAYcwIDJrNm9JDHoLCvC8_clNvGcICtwovwckmnZkuxXBxi-l6hPhDp55bieReyJVqFiE7NeZhsn0QRYr71Zv2DovAcigaND52l--trrmsQdKSjHWgGMuZgXtWeIUTLa79r7Nc9Oy-Kbw_lFYtxRxGCG7_2nY90b88CZ9TM4U9I",
            rating: "4.7",
            time: "20-25'",
            tags: ["Healthy", "Salad"],
            categoryMapping: "Salad"
        },
        {
            id: "3",
            name: "Bếp Bà Ba - Cơm Tấm",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9a1VqKlUkhIcEL2nuuSCtusqbWwP5k-5eh81wdZB94XQzZ1gpAsixXSi7ISlTK_fnpSf-0Zt6TgVUfF3TKYtK9zVgXDy15e4d8z2ItPvPy0bw_Edgn8WgN6Ij9ORjBfGmmcVqC2vL4DLJ_Ff7wcBDg5VAvm7LrqBWtRJHxE1WH2a0J7u1GX56cxCtmkkjlvi8VTihBwmhRqLlVEyaKfe3BUYEwMQjT8AK75JZJwuDmcWBCNnlaGU",
            logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEwP3PIy9AtOhboiYgse91EiCaWhcsgPVLh66b30SvXM4HbOZvKoW0Lys_9C4S4Ynb1XpWHjiYeydihOCAfWiy-VIe2vH1HwrUY1PkMVZ5vpQ7gMHpICD0SVuJ3vKhi7j-IXt5wpVAOQ9cxXCKcizdh84iH5y4pqtDxTVpbVBPpY9fPnFPYrRx5x9Q3NY3xZTsBOiTyu1xEtDPMhfAapKAGVEbYWBzN3hjUQOcPQ9P-MI1iHEfHqE",
            rating: "4.8",
            time: "15-20'",
            tags: ["Cơm Tấm", "Bình dân"],
            categoryMapping: "Pure Veg"
        },
        {
            id: "4",
            name: "Kichi Kichi - Sushi Bar",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy4_lqRjDK6vblNY0ykyt4VgdjjZT-p_AkNQ8mSVLDZ7lMBSHbLfeAU7PlCUSXjOfXGruk14yiRBXFd0GYp-JYVk3a-FVcG5sxVe2AGn2AsNcrHXS5ccL7VU6AkDL9aml-X4u1sz3khE8XuU2hAcrIKuJHBV1_QD7GOiv0UbBQFs-_e64uEnRNh57bDKJm0e4YWDSPBBBRicIEqFOgx77FsxJEIKljHm6O-a-1uaZBBYhpK6bKZvA",
            logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_2tR-mtKe7iW8DFqzbBeDz1D3L8v2RM0fkgb3ehSNhpK2iLtAxIp01CRtEAu5kMPjmlFr7qlCVxCFwKiqmPX_IXn-jK557n-2nnbXmKKMbLBjPS15G2gpCqd_X6VHazYnrYXvC5574FbW8Dx3gwur_dapAS8iqFLowQ-YWGj6Am5ARjAJuMNpJ4BkonukCRVxHCDSi5esfRk21jsVxjBzbbi3rFfni9UjPSL0w4VVu23bUiG0z4s",
            rating: "4.6",
            time: "30-40'",
            tags: ["Sushi", "Nhật"],
            categoryMapping: "Rolls"
        }
    ];

    return (
        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg mt-4">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-headline-md font-headline-md font-bold">Nhà hàng được yêu thích</h2>
                <button onClick={() => navigate('/restaurants')} className="text-primary hover:underline text-label-md">Xem tất cả</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
                {restaurants.map((rest, index) => (
                    <div 
                        key={index} 
                        onClick={() => navigate(`/restaurant/${rest.id}`)}
                        className="bg-surface rounded-2xl overflow-hidden shadow-md card-hover group cursor-pointer border border-outline-variant/30 flex flex-col"
                    >
                        <div className="h-36 relative overflow-hidden">
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={rest.image} alt={rest.name} />
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-label-sm font-bold shadow-sm backdrop-blur-sm bg-opacity-90">Mở cửa</div>
                            <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-surface shadow-md bg-white overflow-hidden z-10">
                                <img className="w-full h-full object-cover" src={rest.logo} alt="Logo" />
                            </div>
                        </div>
                        <div className="pt-8 p-4 flex-grow flex flex-col">
                            <h3 className="text-label-md font-headline-md mb-2 line-clamp-1 text-[16px]">{rest.name}</h3>
                            <div className="flex items-center gap-4 text-on-surface-variant text-label-sm mb-3">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span> 
                                    <span className="font-bold text-on-surface">{rest.rating}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span> 
                                    {rest.time}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {rest.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-surface-container-low text-on-surface px-2 py-1 rounded-lg text-label-sm border border-outline-variant/20">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedRestaurants;
