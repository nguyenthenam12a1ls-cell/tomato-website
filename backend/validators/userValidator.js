import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Tên không được để trống").max(50),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Không đúng định dạng password")
});

export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu không được để trống")
});