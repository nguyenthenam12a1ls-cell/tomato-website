import "dotenv/config";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../config/redis.js", () => ({
    default: {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue("OK"),
        del: jest.fn().mockResolvedValue(1),
        quit: jest.fn().mockResolvedValue(undefined),
        isReady: false,
    }
}));

const { default: app } = await import("../../server.js");
const { prisma } = await import("../../config/prisma.js");
const request = (await import("supertest")).default;

describe("Kiểm thử Tích hợp (Integration Tests)", () => {

    test("GET / - Trả về thông báo API Working", async () => {
        const response = await request(app).get("/");
        // In ra lỗi thực sự để debug
        if (response.status !== 200) {
            console.log("❌ Response body:", JSON.stringify(response.body));
            console.log("❌ Response text:", response.text);
        }
        expect(response.status).toBe(200);
        expect(response.text).toBe("API Working");
    });

});

afterAll(async () => {
    try {
        if (prisma) await prisma.$disconnect();
    } catch (e) {}
});