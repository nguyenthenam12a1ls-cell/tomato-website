import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { assets } from '../../assets/assets'; 
import { useAuth } from '../../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, token, url } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        street: '', ward: '', province: '', country: ''
    });
    
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    // --- LOGIC FORM ---
    const resetForm = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                street: user.street || '',
                ward: user.ward || '',
                province: user.province || '',
                country: user.country || 'Vietnam',
            });
            setAvatarFile(null);
            setAvatarPreview(null);
        }
    };

    useEffect(() => {
        resetForm();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- LOGIC AVATAR (Giữ nguyên) ---
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // --- LOGIC SUBMIT (Giữ nguyên) ---
    const updateProfileMutation = useMutation({
        mutationFn: async (formDataToSubmit) => {
            const response = await axios.put(url + "/api/user/update", formDataToSubmit, {
                headers: { 
                    token: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "Cập nhật hồ sơ thành công!");
                queryClient.invalidateQueries(['userProfile', token]);
                
                setTimeout(() => {
                    navigate('/'); 
                    window.scrollTo(0, 0); 
                }, 1500); 
                
            } else {
                toast.error(data.message || "Cập nhật thất bại.");
            }
        },
        onError: (error) => {
            toast.error("Đã xảy ra lỗi khi cập nhật.");
        }
    });

    // --- ĐÃ SỬA LỖI Ở ĐÂY ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSubmit.append(key, formData[key]);
        });
        if (avatarFile) {
            formDataToSubmit.append('avatar', avatarFile);
        }
        // Sửa 'formDataToSumbit' thành 'formDataToSubmit'
        updateProfileMutation.mutate(formDataToSubmit); 
    };
    // ------------------------

    if (!user) {
        return (
            <div className="profile-page-loading">
                <div className="spinner"></div>
                <p>Đang tải thông tin hồ sơ...</p>
            </div>
        );
    }

    let avatarToShow;
    if (avatarPreview) {
        avatarToShow = <img src={avatarPreview} alt="Xem trước" className="profile-avatar-image" />;
    } else if (user.avatar) {
        avatarToShow = <img src={`${url}/images/${user.avatar}`} alt="Avatar" className="profile-avatar-image" />;
    } else {
        avatarToShow = (
            <div className="avatar-placeholder">
                <img src={assets.profile_icon_large || assets.profile_icon} alt="Avatar" />
            </div>
        );
    }

    return (
        <div className="profile-page">
            
            <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                    {avatarToShow}
                    <button type="button" className="change-avatar-btn" onClick={() => fileInputRef.current.click()}></button>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
                </div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
                
                <div className="profile-form-columns">

                    {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
                    <div className="profile-form-column">
                        <h2 className="profile-title section-title">Thông tin cá nhân</h2>
                        <div className="form-group">
                            <label htmlFor="name">Tên</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} readOnly disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>

                    {/* CỘT PHẢI: ĐỊA CHỈ */}
                    <div className="profile-form-column">
                        <h2 className="profile-title section-title">Địa chỉ Giao hàng</h2>
                        
                        <div className="form-group">
                            <label htmlFor="country">Quốc gia</label>
                            <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="province">Tỉnh/Thành phố</label>
                            <input type="text" id="province" name="province" value={formData.province} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="ward">Xã/Phường</label>
                            <input type="text" id="ward" name="ward" value={formData.ward} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="street">Địa chỉ (Số nhà, Tên đường)</label>
                            <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                
                {/* NÚT BẤM */}
                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={resetForm} disabled={updateProfileMutation.isPending}>
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;