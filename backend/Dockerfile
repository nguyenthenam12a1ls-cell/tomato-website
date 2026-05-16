# 1. Chọn hệ điều hành có cài sẵn Node.js (dùng bản 20 cho ổn định)
FROM node:20-alpine

# 2. Tạo thư mục làm việc bên trong thùng hàng
WORKDIR /app

# 3. Copy 2 file package.json và package-lock.json vào trước
COPY package*.json ./

# 4. Cài đặt các thư viện (Chạy lệnh gì để cài node_modules?)
RUN npm install

# 5. Copy toàn bộ code còn lại vào thùng hàng
COPY . .

# 6. Vì bạn dùng Prisma, phải chạy lệnh để tạo Prisma Client (Truyền URL giả để lừa Prisma)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma generate

# 7. Mở cổng 4000 cho bên ngoài gọi vào
EXPOSE 4000

# 8. Lệnh cuối cùng để khởi động server (Chạy thật bằng node, không dùng nodemon)
CMD ["node", "server.js"]
