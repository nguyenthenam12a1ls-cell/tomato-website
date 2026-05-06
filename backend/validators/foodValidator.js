import { z } from "zod"

export const schema = z.object({
    name: z.string().min(1, "Tên không được rỗng").max(100, "Tên tối đa 100 ký tự"),
    description: z.string().min(1, "Mô tả không được rỗng"),
    price: z.coerce.number().positive("Giá phải là số dương"),
    category: z.string().min(1, "Danh mục không được rỗng")
});