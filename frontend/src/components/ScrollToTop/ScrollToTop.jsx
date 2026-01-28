import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Component này không hiển thị gì cả, nó chỉ chạy 1 hiệu ứng
const ScrollToTop = () => {
  // Lấy ra "pathname" (ví dụ: "/", "/about-us", "/cart")
  const { pathname } = useLocation();

  // Chạy hiệu ứng này mỗi khi 'pathname' thay đổi
  useEffect(() => {
    // Cuộn cửa sổ về vị trí 0, 0
    window.scrollTo(0, 0);
  }, [pathname]); // Phụ thuộc vào pathname

  return null; // Không render ra HTML
};

export default ScrollToTop;