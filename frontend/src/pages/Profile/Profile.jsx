import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';

const Profile = () => {
    const { user, token, url, isUserLoading, isUserError, userError } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '1995-05-15',
        bio: '',
        gender: 'male' // Added based on design
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarLoadError, setAvatarLoadError] = useState(false);

    const fileInputRef = useRef(null);

    const resetForm = () => {
        if (!user) return;

        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            dob: user.dob || '1995-05-15',
            bio: user.bio || '',
            gender: user.gender || 'male'
        });
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    useEffect(() => {
        resetForm();
    }, [user]);

    useEffect(() => {
        setAvatarLoadError(false);
    }, [user?.avatar, avatarPreview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const updateProfileMutation = useMutation({
        mutationFn: async (formDataToSubmit) => {
            const response = await axios.put(`${url}/api/user/update`, formDataToSubmit, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Cập nhật thất bại.');
                return;
            }

            toast.success(data.message || 'Cập nhật hồ sơ thành công!');
            queryClient.invalidateQueries({ queryKey: ['userProfile', token] });

            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 1500);
        },
        onError: () => {
            toast.error('Đã xảy ra lỗi khi cập nhật.');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSubmit.append(key, formData[key]);
        });

        if (avatarFile) {
            formDataToSubmit.append('avatar', avatarFile);
        }

        updateProfileMutation.mutate(formDataToSubmit);
    };

    const getAvatarSrc = (avatar) => {
        if (!avatar) return '';
        if (/^(https?:)?\/\//i.test(avatar) || avatar.startsWith('data:')) {
            return avatar;
        }
        return `${url}/images/${avatar}`;
    };

    if (isUserLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isUserError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-error font-bold text-lg">{userError?.message || 'Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại.'}</p>
            </div>
        );
    }

    let avatarToShow;
    if (avatarPreview) {
        avatarToShow = <img src={avatarPreview} alt="Xem trước" className="w-full h-full object-cover rounded-full" />;
    } else if (user.avatar && !avatarLoadError) {
        avatarToShow = (
            <img
                src={getAvatarSrc(user.avatar)}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={() => setAvatarLoadError(true)}
            />
        );
    } else {
        avatarToShow = (
            <div className="w-full h-full bg-surface-variant flex items-center justify-center rounded-full text-on-surface-variant">
                <span className="material-symbols-outlined text-[40px]">person</span>
            </div>
        );
    }

    return (
        <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg lg:py-stack-xl flex flex-col md:flex-row gap-gutter mt-20">
            
            <ProfileSidebar />

            {/* RIGHT CONTENT */}
            <section className="flex-grow">
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
                    <div className="p-stack-lg border-b border-surface-variant bg-surface-container-low">
                        <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-on-surface font-bold">Thông tin cá nhân</h1>
                    </div>
                    
                    <div className="p-stack-lg space-y-stack-xl">
                        {/* Avatar Upload Zone */}
                        <div>
                            <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-stack-md font-bold">Ảnh đại diện</h3>
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-bright group hover:border-primary transition-colors cursor-pointer relative"
                            >
                                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
                                
                                {avatarPreview || (user.avatar && !avatarLoadError) ? (
                                    <div className="w-32 h-32 rounded-full border-4 border-primary p-1 shadow-[0_0_20px_rgba(182,26,9,0.15)] mb-4">
                                        {avatarToShow}
                                    </div>
                                ) : (
                                    <span className="material-symbols-outlined text-[48px] text-outline group-hover:text-primary mb-2 transition-colors">cloud_upload</span>
                                )}
                                
                                <p className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors mt-2">Kéo thả ảnh hoặc <span className="text-primary font-bold">Chọn tệp</span></p>
                                <p className="text-label-sm text-outline mt-1 italic">Dung lượng tối đa: 5MB (JPG, PNG)</p>
                            </div>
                        </div>

                        {/* Main Form */}
                        <form id="profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                            <div className="space-y-stack-xs">
                                <label className="font-label-md text-on-surface-variant font-bold">Họ và Tên</label>
                                <input className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-colors" type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            
                            <div className="space-y-stack-xs">
                                <label className="font-label-md text-on-surface-variant font-bold">Email</label>
                                <input className="w-full h-12 px-4 rounded-lg border border-surface-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed italic outline-none" disabled type="email" value={formData.email} />
                            </div>
                            
                            <div className="space-y-stack-xs">
                                <label className="font-label-md text-on-surface-variant font-bold">Số điện thoại</label>
                                <input className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-colors" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            
                            <div className="space-y-stack-xs">
                                <label className="font-label-md text-on-surface-variant font-bold">Ngày sinh</label>
                                <div className="relative">
                                    <input className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-colors" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                </div>
                            </div>
                            
                            <div className="space-y-stack-xs md:col-span-2">
                                <label className="font-label-md text-on-surface-variant font-bold">Giới tính</label>
                                <div className="flex items-center space-x-gutter pt-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <input className="w-5 h-5 text-primary border-outline focus:ring-primary" name="gender" type="radio" value="male" checked={formData.gender === 'male'} onChange={handleChange}/>
                                        <span className="ml-2 font-body-md text-on-surface group-hover:text-primary transition-colors">Nam</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input className="w-5 h-5 text-primary border-outline focus:ring-primary" name="gender" type="radio" value="female" checked={formData.gender === 'female'} onChange={handleChange}/>
                                        <span className="ml-2 font-body-md text-on-surface group-hover:text-primary transition-colors">Nữ</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input className="w-5 h-5 text-primary border-outline focus:ring-primary" name="gender" type="radio" value="other" checked={formData.gender === 'other'} onChange={handleChange}/>
                                        <span className="ml-2 font-body-md text-on-surface group-hover:text-primary transition-colors">Khác</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="space-y-stack-xs md:col-span-2">
                                <label className="font-label-md text-on-surface-variant font-bold">Tiểu sử (Bio)</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-colors resize-none" placeholder="Chia sẻ một chút về sở thích ẩm thực của bạn..." rows="3"></textarea>
                            </div>
                        </form>

                        {/* Account Linking */}
                        <div className="bg-surface-container-low rounded-xl p-stack-lg border border-surface-variant">
                            <h3 className="font-headline-md text-on-surface mb-stack-md font-bold text-[20px]">Liên kết tài khoản</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
                                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-surface-variant">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.2-4.53z" fill="#EA4335"></path>
                                        </svg>
                                        <span className="font-label-md font-bold">Google</span>
                                    </div>
                                    <div className="flex items-center text-[#34A853] font-bold text-label-sm">
                                        Đã liên kết
                                        <span className="material-symbols-outlined ml-1 text-[18px]">check_circle</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-surface-variant">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-3 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                                        </svg>
                                        <span className="font-label-md font-bold">Facebook</span>
                                    </div>
                                    <button className="text-primary font-bold text-label-sm hover:underline">Liên kết ngay</button>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    {/* Footer CTA */}
                    <div className="flex justify-end p-stack-lg border-t border-surface-variant bg-surface-container-lowest">
                        <button 
                            type="submit" 
                            form="profile-form"
                            disabled={updateProfileMutation.isPending}
                            className="bg-primary text-on-primary px-12 py-4 rounded-xl font-bold text-body-lg shadow-lg hover:bg-primary-container hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>

                </div>
            </section>
        </main>
    );
};

export default Profile;
