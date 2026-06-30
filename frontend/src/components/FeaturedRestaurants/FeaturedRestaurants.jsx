import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';

const FeaturedRestaurants = () => {
    const navigate = useNavigate();
    const { url } = useAuth();

    // Dùng chung queryKey 'restaurants' để tận dụng cache từ thư viện React Query (không phải gọi lại mạng nếu vừa vào trang Restaurants)
    const { data: restaurants = [], isLoading } = useQuery({
        queryKey: ['restaurants'],
        queryFn: async () => {
            const res = await axios.get(url + '/api/restaurant/list');
            return res.data.data;
        }
    });

    // Chỉ lấy 4 nhà hàng đầu tiên để hiển thị ngoài trang chủ
    const featuredList = restaurants.slice(0, 4);

    const getImageUrl = (imageName) => {
        if (!imageName) return "";
        if (imageName.startsWith("http")) return imageName;
        return url + "/images/" + imageName;
    };

    return (
        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg mt-4">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-headline-md font-headline-md font-bold">Nhà hàng được yêu thích</h2>
                <button onClick={() => navigate('/restaurants')} className="text-primary hover:underline text-label-md">Xem tất cả</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
                {isLoading ? (
                    // Skeleton Loading
                    [1, 2, 3, 4].map(n => (
                        <div key={n} className="bg-white rounded-2xl h-[300px] border border-outline-variant/30 animate-pulse">
                            <div className="h-36 bg-gray-200 rounded-t-2xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    featuredList.map((rest) => (
                        <div 
                            key={rest.id} 
                            onClick={() => navigate(`/restaurant/${rest.id}`)}
                            className="bg-surface rounded-2xl overflow-hidden shadow-md card-hover group cursor-pointer border border-outline-variant/30 flex flex-col"
                        >
                            <div className="h-36 relative overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImageUrl(rest.image)} alt={rest.name} />
                                {rest.isOpen && <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-label-sm font-bold shadow-sm backdrop-blur-sm bg-opacity-90">Mở cửa</div>}
                                <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-surface shadow-md bg-white overflow-hidden z-10">
                                    <img className="w-full h-full object-cover" src={getImageUrl(rest.logo)} alt="Logo" />
                                </div>
                            </div>
                            <div className="pt-8 p-4 flex-grow flex flex-col">
                                <h3 className="text-label-md font-headline-md mb-2 line-clamp-1 text-[16px]">{rest.name}</h3>
                                <div className="flex items-center gap-4 text-on-surface-variant text-label-sm mb-3">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span> 
                                        <span className="font-bold text-on-surface">{rest.rating || "5.0"}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span> 
                                        {rest.deliveryTime || "30-45'"}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {rest.tags && rest.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-surface-container-low text-on-surface px-2 py-1 rounded-lg text-label-sm border border-outline-variant/20">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default FeaturedRestaurants;
