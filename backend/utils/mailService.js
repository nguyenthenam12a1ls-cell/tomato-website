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

export const sendOrderConfirmationEmail = async (toEmail, order) => {
    try {
        await transporter.sendMail({
            from: `"Tomato Food" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Xác nhận đơn hàng #" + order.id,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eeeeee; border-radius: 10px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #ff6347; padding: 20px; text-align: center;">
             <h1 style="color: white; margin: 0; font-size: 28px;">🍅 Tomato Food</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; color: #333333;">
            <h2 style="color: #ff6347;">Cảm ơn bạn đã đặt hàng!</h2>
            <p>Chào bạn,</p>
            <p>Đơn hàng của bạn đã được xác nhận và đang trong quá trình chuẩn bị.</p>
        
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Mã đơn hàng:</b> #${order.id}</p>
            <p style="margin: 5px 0;"><b>Tổng thanh toán:</b> <span style="color: #ff6347; font-weight: bold;">${order.amount} ${order.currency.toUpperCase()}</span></p>
            <p style="margin: 5px 0;"><b>Phương thức:</b> ${order.paymentMethod.toUpperCase()}</p>
            <p style="margin: 5px 0;"><b>Trạng thái:</b> Đã thanh toán ✅</p>
            </div>

            <p>Chúng tôi sẽ sớm giao hàng đến địa chỉ của bạn. Bạn có thể kiểm tra trạng thái đơn hàng trong mục <b>"My Orders"</b> trên website.</p>
        
            <a href="${process.env.FRONTEND_URL}/myorders" style="display: inline-block; background-color: #ff6347; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Xem đơn hàng của tôi</a>
            </div>

           <!-- Footer -->
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ hotline: 1900-TOMATO</p>
        <p>© 2024 Tomato Food. All rights reserved.</p>
        </div>
        </div>
        `
        });
    } catch (error) {
        console.error("Lỗi khi gửi email: " + error);
    }
}