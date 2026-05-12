import { z } from "zod"

export const orderSchema = z.object({
    paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
    amount: z.coerce.number().positive(),
    address: z.object({
        firstName: z.string().min(1, "Thiếu họ"),
        lastName: z.string().min(1, "Thiếu tên"),
        email: z.string().email("Email không hợp lệ"),
        street: z.string().min(1, "Thiếu tên đường"),
        city: z.string().min(1, "Thiếu tên thành phố"),
        state: z.string().min(1, "Thiếu state"),
        zipcode: z.string().min(1, "Thiếu mã bưu chính"),
        country: z.string().min(1, "Thiếu tên địa phương"),
        phone: z.string().min(1, "Thiếu số điện thoại")
    }),
    items: z.array(z.any()).min(1, "Giỏ hàng không được để trống")
})