import React from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-surface-container-lowest border-t border-outline-variant/30 mt-20" id="footer">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-4 md:px-margin-desktop py-stack-xl max-w-container-max mx-auto">
                <div className="space-y-4">
                    <h3 className="text-headline-md font-headline-md font-extrabold text-primary">Tomato</h3>
                    <p className="text-body-md text-on-surface-variant">Dịch vụ giao đồ ăn hàng đầu Việt Nam, kết nối hàng ngàn tinh hoa ẩm thực đến tận cửa nhà bạn.</p>
                    <div className="flex gap-4 pt-2">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                            <img src={assets.facebook_icon} alt="Facebook" className="w-5 h-5 opacity-80" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                            <img src={assets.twitter_icon} alt="Twitter" className="w-5 h-5 opacity-80" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                            <img src={assets.linkedin_icon} alt="LinkedIn" className="w-5 h-5 opacity-80" />
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-secondary mb-4">Danh mục</h4>
                    <ul className="space-y-2 text-label-md text-on-surface-variant">
                        <li><a className="hover:text-primary transition-colors" href="/#explore-menu">Món Việt</a></li>
                        <li><a className="hover:text-primary transition-colors" href="/#explore-menu">Món Âu</a></li>
                        <li><a className="hover:text-primary transition-colors" href="/#explore-menu">Đồ uống</a></li>
                        <li><a className="hover:text-primary transition-colors" href="/#explore-menu">Bánh ngọt</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-bold text-secondary mb-4">Công ty</h4>
                    <ul className="space-y-2 text-label-md text-on-surface-variant">
                        <li><Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
                        <li><Link to="/about-us" className="hover:text-primary transition-colors">Về chúng tôi</Link></li>
                        <li><Link to="/delivery" className="hover:text-primary transition-colors">Vận chuyển</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Chính sách pháp lý</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-bold text-secondary mb-4">Liên hệ</h4>
                    <ul className="space-y-2 text-label-md text-on-surface-variant">
                        <li><a className="hover:text-primary transition-colors flex items-center gap-2" href="tel:+9112345678"><span className="material-symbols-outlined text-[18px]">call</span> +91-1234-5678</a></li>
                        <li><a className="hover:text-primary transition-colors flex items-center gap-2" href="mailto:contact@tomato.com"><span className="material-symbols-outlined text-[18px]">mail</span> contact@tomato.com</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 border-t border-outline-variant/30 text-center text-label-sm text-on-surface-variant">
                © 2025 Tomato Food Delivery. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;