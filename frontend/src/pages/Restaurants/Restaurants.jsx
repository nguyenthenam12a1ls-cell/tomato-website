import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';

const Restaurants = () => {
    const navigate = useNavigate();
    const { url } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    // Gọi API lấy danh sách nhà hàng thật từ Backend
    const { data: restaurants = [], isLoading } = useQuery({
        queryKey: ['restaurants'],
        queryFn: async () => {
            const res = await axios.get(url + '/api/restaurant/list');
            return res.data.data; // .data đầu là của axios, .data sau là của res.json()
        }
    });

    // Lọc nhà hàng theo tên hoặc tag (Giữ nguyên logic cũ)
    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.tags && r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    // Hàm nhỏ hỗ trợ load link ảnh: Nếu là link ngoài (bắt đầu bằng http) thì lấy luôn, nếu là ảnh upload thì nối với url backend
    const getImageUrl = (imageName) => {
        if (!imageName) return "";
        if (imageName.startsWith("http")) return imageName;
        return url + "/images/" + imageName;
    };

    return (
        <main className="pt-28 pb-16 min-h-screen bg-background">
            <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">

                {/* Header & Location */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-on-surface font-bold mb-2">Nhà hàng gần bạn</h1>
                        <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-1.5 w-fit cursor-pointer hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
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
                {isLoading ? (
                    // Hiệu ứng Loading Skeleton nhấp nháy khi đang fetch data
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 h-[300px] animate-pulse">
                                <div className="h-36 bg-gray-200"></div>
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredRestaurants.map((rest) => (
                            <div
                                key={rest.id}
                                onClick={() => navigate(`/restaurant/${rest.id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group cursor-pointer border border-outline-variant/30 flex flex-col"
                            >
                                <div className="h-36 relative overflow-hidden bg-gray-100">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImageUrl(rest.image)} alt={rest.name} />
                                    {rest.isOpen && <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-label-sm font-bold shadow-sm backdrop-blur-sm bg-opacity-90 text-[11px]">Mở cửa</div>}
                                    <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-white shadow-md bg-white overflow-hidden z-10">
                                        <img className="w-full h-full object-cover" src={getImageUrl(rest.logo)} alt="Logo" />
                                    </div>
                                </div>
                                <div className="pt-8 p-4 flex-grow flex flex-col">
                                    <h3 className="text-label-md font-headline-md mb-1 line-clamp-1 text-[16px] font-bold group-hover:text-primary transition-colors">{rest.name}</h3>
                                    <p className="text-on-surface-variant font-body-sm text-[12px] mb-2 line-clamp-1">{rest.description}</p>
                                    <div className="flex items-center gap-4 text-on-surface-variant text-label-sm mb-3">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="font-bold text-on-surface">{rest.rating || "5.0"}</span>
                                        </span>
                                        <span className="flex items-center gap-1 text-[12px]">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                                            {rest.deliveryTime || "30-45'"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {rest.tags && rest.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-surface-container-low text-on-surface px-2 py-1 rounded-lg text-label-sm border border-outline-variant/20 text-[11px]">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Hiển thị khi tìm kiếm không có kết quả */}
                        {filteredRestaurants.length === 0 && (
                            <div className="col-span-full text-center py-10 text-on-surface-variant">
                                Không tìm thấy nhà hàng nào phù hợp với từ khoá.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Restaurants;
