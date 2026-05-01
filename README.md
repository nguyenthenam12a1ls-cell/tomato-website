# Tomato Food Delivery Platform

Modern food ordering platform with a customer app, admin dashboard, and Express API backed by Prisma and PostgreSQL.

## Overview

This repository contains three applications:

- `frontend` for the customer-facing ordering experience
- `admin` for internal food, order, and dashboard management
- `backend` for authentication, cart, order, payment, and data access APIs

The backend now uses `Prisma + PostgreSQL` as the primary data layer.

## Architecture Notes

The backend has been migrated to Prisma + PostgreSQL. Responses are modeled for the relational schema and the runtime uses Prisma + PostgreSQL.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, React Query, React Toastify |
| Admin | React 19, Vite, Axios, Chart.js, React Toastify |
| Backend | Node.js, Express, Prisma ORM, PostgreSQL, JWT, Passport, Multer, Nodemailer |
| Payments | Stripe, VNPay |

## Core Features

- Email/password authentication
- Google OAuth login
- Password reset by email
- User profile management
- Food catalog management
- Cart with quantity tracking
- Order creation and payment verification
- Admin dashboard with order and revenue views

## Repository Structure

```text
tomato-website/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |-- routes/
|   |-- uploads/
|   |-- utils/
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- public/
|   |-- src/
|   `-- package.json
`-- admin/
    |-- public/
    |-- src/
    `-- package.json
```

## Data Model

Current main Prisma models:

- `User`
- `Food`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`

Schema source:

- [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

## Environment Setup

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

## Getting Started

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

### 2. Apply Prisma migrations

Production-style migration:

```bash
cd backend
npx prisma migrate deploy
```

Local development migration:

```bash
cd backend
npx prisma migrate dev
```

### 3. Start the applications

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

## API Summary

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

## Current Backend Status

Backend migration is now applied in the main runtime path:

- `server.js` uses Prisma + PostgreSQL
- `userController.js` uses Prisma
- `passport.js` uses Prisma
- `cartController.js` uses `Cart` and `CartItem`
- `orderController.js` uses `Order` and `OrderItem`

## Development Notes

- If you change the Prisma schema, re-run migrations before testing related routes.

## Author

- GitHub: https://github.com/nguyenthenam12a1ls-cell
- Email: kiritonguyen1411lh@gmail.com
