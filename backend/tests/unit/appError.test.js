import AppError from "../../utils/AppError.js";

describe("Test hàm AppError", () => {
    test("Hàm AppError có bị lỗi không", () => {
        const error = new AppError("Lỗi", 404);
        expect(error.message).toBe("Lỗi");
        expect(error.statusCode).toBe(404);
    });
});
