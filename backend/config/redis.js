import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => console.log("Redis client error: ", err));
client.on('connect', () => console.log("Redis Connected!"));

// Chỉ kết nối nếu KHÔNG phải môi trường test
if (process.env.NODE_ENV !== "test") {
    await client.connect();
}

export default client;