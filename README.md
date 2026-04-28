# Food Delivery Platform

Full-stack food ordering platform with:

- `frontend`: customer-facing React app
- `admin`: React admin dashboard
- `backend`: Express API using Prisma with PostgreSQL

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- React Query
- React Toastify

### Admin
- React 19
- Vite
- Axios
- Chart.js
- React Toastify

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- Passport Google OAuth
- Multer
- Nodemailer
- Stripe
- VNPay

## Current Architecture

The project is being migrated from MongoDB/Mongoose to Prisma + PostgreSQL.

Current backend direction:

- user auth and profile logic use Prisma
- Google OAuth uses Prisma
- cart logic uses `Cart` and `CartItem`
- order logic uses `Order` and `OrderItem`
- Prisma schema and migrations live in `backend/prisma`

## Project Structure

```text
tomato-website/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── admin/
    ├── src/
    ├── public/
    └── package.json
```

## Backend Data Model

Main Prisma models:

- `User`
- `Food`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`

## Environment Variables

Create `backend/.env` with values similar to:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME

NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

STRIPE_SECRET_KEY=your_stripe_secret_key
VNP_TMNCODE=your_vnpay_tmn_code
VNP_HASHSECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

## Installation

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

Admin:

```bash
cd admin
npm install
```

### 2. Run Prisma migrations

```bash
cd backend
npx prisma migrate deploy
```

For local development, if needed:

```bash
npx prisma migrate dev
```

### 3. Start the apps

Backend:

```bash
cd backend
npm run server
```

Frontend:

```bash
cd frontend
npm run dev
```

Admin:

```bash
cd admin
npm run dev
```

## Main API Routes

### User
- `POST /api/user/register`
- `POST /api/user/login`
- `POST /api/user/logout`
- `POST /api/user/getadmin`
- `GET /api/user/profile`
- `PUT /api/user/update`
- `GET /api/user/auth/google`
- `GET /api/user/auth/google/callback`
- `POST /api/user/forgot-password`
- `POST /api/user/reset-password/:token`

### Food
- `GET /api/food/list`
- `GET /api/food/get/:foodId`
- `POST /api/food/add`
- `POST /api/food/update`
- `POST /api/food/remove`

### Cart
- `POST /api/cart/add`
- `POST /api/cart/remove`
- `POST /api/cart/get`

### Order
- `POST /api/order/place`
- `POST /api/order/verify`
- `GET /api/order/vnpay_return`
- `POST /api/order/userorders`
- `GET /api/order/list`
- `POST /api/order/status`
- `GET /api/order/stats`
- `GET /api/order/recent`
- `GET /api/order/monthly`
- `GET /api/order/quarterly`
- `GET /api/order/yearly`

## Notes

- The README now reflects the selected stack: `Express + Prisma + PostgreSQL`.
- Some frontend/admin parts may still use compatibility response shapes such as `_id`, `address`, and `items`.
- If you continue the migration, update README again after frontend is fully aligned with Prisma-based responses.
