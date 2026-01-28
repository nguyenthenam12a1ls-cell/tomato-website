# 🍔 Food Delivery Platform

<div align="center">

![Food Delivery](https://img.shields.io/badge/Food-Delivery-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

**Hệ thống đặt đồ ăn trực tuyến toàn diện với giao diện người dùng hiện đại và bảng quản trị mạnh mẽ**

[Tính Năng](#-tính-năng) • [Công Nghệ](#-công-nghệ-sử-dụng) • [Cài Đặt](#-cài-đặt) • [Sử Dụng](#-sử-dụng) • [Cấu Trúc](#-cấu-trúc-dự-án)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Đóng Góp](#-đóng-góp)
- [License](#-license)

---

## 🎯 Giới Thiệu

**Food Delivery Platform** là một hệ thống đặt đồ ăn trực tuyến đầy đủ tính năng, được xây dựng với kiến trúc MERN stack (MongoDB, Express.js, React, Node.js). Dự án bao gồm 3 ứng dụng chính:

- **Frontend**: Giao diện người dùng để duyệt món ăn, đặt hàng và quản lý tài khoản
- **Admin Panel**: Bảng điều khiển quản trị để quản lý món ăn, đơn hàng và thống kê
- **Backend API**: RESTful API server xử lý logic nghiệp vụ và kết nối database

---

## ✨ Tính Năng

### 🛒 Frontend (Khách Hàng)

- **Xác thực người dùng**
  - Đăng ký/Đăng nhập với email & password
  - Đăng nhập với Google OAuth 2.0
  - Quên mật khẩu & đặt lại mật khẩu qua email
  - Quản lý hồ sơ cá nhân với avatar

- **Duyệt & Đặt Hàng**
  - Xem danh sách món ăn với phân loại
  - Tìm kiếm và lọc món ăn
  - Xem chi tiết món ăn
  - Giỏ hàng với tính năng thêm/xóa/cập nhật số lượng
  - Đặt hàng với nhiều phương thức thanh toán

- **Thanh Toán**
  - Stripe (Thanh toán quốc tế - USD)
  - VNPay (Thanh toán Việt Nam - VND)
  - Tự động quy đổi tiền tệ

- **Quản Lý Đơn Hàng**
  - Xem lịch sử đơn hàng
  - Theo dõi trạng thái đơn hàng real-time
  - Nhận thông báo qua email

- **Chatbot AI**
  - Hỗ trợ khách hàng tự động
  - Tích hợp Google Generative AI

- **Giao Diện**
  - Responsive design cho mọi thiết bị
  - Loading skeleton cho UX tốt hơn
  - Toast notifications
  - Lazy loading components

### 🎛️ Admin Panel

- **Dashboard**
  - Thống kê tổng quan (doanh thu, đơn hàng, người dùng)
  - Biểu đồ doanh thu theo tháng/quý/năm
  - Danh sách đơn hàng gần đây

- **Quản Lý Món Ăn**
  - Thêm/Sửa/Xóa món ăn
  - Upload hình ảnh món ăn
  - Phân loại món ăn

- **Quản Lý Đơn Hàng**
  - Xem tất cả đơn hàng
  - Cập nhật trạng thái đơn hàng
  - Lọc và tìm kiếm đơn hàng

- **Xác Thực Admin**
  - Đăng nhập bảo mật
  - JWT token authentication

### 🔧 Backend API

- **RESTful API** với Express.js
- **MongoDB** database với Mongoose ODM
- **JWT** authentication
- **Passport.js** cho Google OAuth
- **Multer** cho upload files
- **Nodemailer** cho gửi email
- **Stripe & VNPay** integration
- **CORS** enabled
- **Environment-based** configuration

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend & Admin
- **React** 19.1.1 - UI library
- **Vite** 7.1.7 - Build tool & dev server
- **React Router DOM** 7.9.4 - Routing
- **Axios** 1.12.2 - HTTP client
- **React Toastify** 11.0.5 - Notifications
- **React Query** 5.90.7 - Data fetching (Frontend)
- **Chart.js** 4.5.1 - Data visualization (Admin)
- **React Loading Skeleton** 3.5.0 - Loading states

### Backend
- **Node.js** - Runtime environment
- **Express** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.19.1 - ODM
- **JWT** - Authentication
- **Passport** 0.7.0 - OAuth middleware
- **Bcrypt** 6.0.0 - Password hashing
- **Multer** 2.0.2 - File uploads
- **Nodemailer** 7.0.10 - Email service
- **Stripe** 19.1.0 - Payment gateway
- **Google Generative AI** 0.24.1 - Chatbot
- **Dotenv** 17.2.3 - Environment variables

---

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- **Node.js** >= 16.x
- **npm** hoặc **yarn**
- **MongoDB** (local hoặc MongoDB Atlas)
- **Git**

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd "Project website"
```

### Bước 2: Cài Đặt Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

#### Admin
```bash
cd ../admin
npm install
```

### Bước 3: Cấu Hình Environment Variables

#### Backend (.env)

Tạo file `.env` trong thư mục `backend` (hoặc copy từ `.env.example`):

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
VNP_TMNCODE=your_vnpay_tmncode
VNP_HASHSECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

> **Lưu ý**: Xem file `.env.example` để biết chi tiết về từng biến môi trường.

---

## 🚀 Sử Dụng

### Development Mode

Mở 3 terminal riêng biệt:

#### Terminal 1 - Backend Server
```bash
cd backend
npm run server
```
Server sẽ chạy tại `http://localhost:4000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại `http://localhost:5173`

#### Terminal 3 - Admin Panel
```bash
cd admin
npm run dev
```
Admin panel sẽ chạy tại `http://localhost:5174`

### Production Build

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

#### Admin
```bash
cd admin
npm run build
npm run preview
```

---

## 📁 Cấu Trúc Dự Án

```
Project website/
├── backend/                 # Backend API Server
│   ├── config/             # Cấu hình (DB, Passport)
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── uploads/            # Uploaded files
│   ├── .env                # Environment variables
│   ├── .env.example        # Environment template
│   ├── server.js           # Entry point
│   └── package.json
│
├── frontend/               # Customer Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, icons
│   │   ├── components/    # Reusable components
│   │   ├── Context/       # React Context
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── admin/                  # Admin Panel
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/     # Admin components
    │   ├── context/        # Admin context
    │   ├── pages/          # Admin pages
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register` - Đăng ký tài khoản
- `POST /api/user/login` - Đăng nhập
- `POST /api/user/logout` - Đăng xuất
- `GET /api/user/auth/google` - Google OAuth
- `POST /api/user/forgot-password` - Quên mật khẩu
- `POST /api/user/reset-password/:token` - Đặt lại mật khẩu

### User Profile
- `GET /api/user/profile` - Lấy thông tin profile
- `PUT /api/user/profile` - Cập nhật profile

### Food
- `GET /api/food/list` - Lấy danh sách món ăn
- `GET /api/food/:foodId` - Lấy chi tiết món ăn
- `POST /api/food/add` - Thêm món ăn (Admin)
- `PUT /api/food/update` - Cập nhật món ăn (Admin)
- `DELETE /api/food/remove` - Xóa món ăn (Admin)

### Cart
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `POST /api/cart/remove` - Xóa khỏi giỏ hàng
- `GET /api/cart/get` - Lấy giỏ hàng

### Orders
- `POST /api/order/place` - Đặt hàng
- `POST /api/order/verify` - Xác thực thanh toán
- `GET /api/order/vnpay_return` - VNPay callback
- `GET /api/order/userorders` - Đơn hàng của user
- `GET /api/order/list` - Tất cả đơn hàng (Admin)
- `POST /api/order/status` - Cập nhật trạng thái (Admin)

### Dashboard (Admin)
- `GET /api/order/stats` - Thống kê tổng quan
- `GET /api/order/recent` - Đơn hàng gần đây
- `GET /api/order/revenue/monthly` - Doanh thu theo tháng
- `GET /api/order/revenue/quarterly` - Doanh thu theo quý
- `GET /api/order/revenue/yearly` - Doanh thu theo năm

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT | ✅ |
| `SESSION_SECRET` | Secret key for sessions | ✅ |
| `FRONTEND_URL` | Frontend URL | ✅ |
| `ADMIN_URL` | Admin panel URL | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ⚠️ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | ⚠️ |
| `SMTP_USER` | SMTP username | ⚠️ |
| `SMTP_PASS` | SMTP password | ⚠️ |
| `EMAIL_USER` | Gmail address | ⚠️ |
| `EMAIL_PASS` | Gmail app password | ⚠️ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ⚠️ |
| `VNP_TMNCODE` | VNPay terminal code | ⚠️ |
| `VNP_HASHSECRET` | VNPay hash secret | ⚠️ |

✅ = Required | ⚠️ = Optional (tùy tính năng)

---

## 📸 Screenshots

> **Lưu ý**: Thêm screenshots của ứng dụng tại đây

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

## 📝 License

Dự án này được phát hành dưới MIT License.

---

## 👨‍💻 Tác Giả

**Your Name**
- Email: babanguyen325@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [VNPay](https://vnpay.vn/)
- [Google Cloud](https://cloud.google.com/)

---

<div align="center">

**⭐ Nếu dự án này hữu ích, hãy cho một star! ⭐**

Made with ❤️ by [Your Name]

</div>
