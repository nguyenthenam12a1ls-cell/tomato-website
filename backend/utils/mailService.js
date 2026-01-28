import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendPasswordResetEmail = async (toEmail, resetLink) => {
    try {
        await transporter.sendMail({
            from: `"Tomato Food" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Yêu cầu đặt lại mật khẩu của bạn',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Bạn đã yêu cầu đặt lại mật khẩu?</h2>
                    <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút.</p>
                    <a href="${resetLink}" style="background-color: tomato; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Đặt lại mật khẩu
                    </a>
                    <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
                </div>
            `
        });
        console.log("Email đặt lại mật khẩu đã được gửi.");
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
    }
};