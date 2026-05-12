import { z } from "zod"

export const cartSchema = z.object({
    itemId: z.coerce.number().positive("ID món ăn phải hợp lệ")
});