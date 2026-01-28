import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';
import 'dotenv/config';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // URL này PHẢI KHỚP với Google Cloud Console VÀ userRoute.js
    callbackURL: "/api/user/auth/google/callback", 
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Kiểm tra xem user đã tồn tại với googleId chưa
        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user); // Đã có, cho đăng nhập
        }

        // 2. Nếu chưa có googleId, kiểm tra xem email đã tồn tại chưa
        user = await userModel.findOne({ email: profile.emails[0].value });

        if (user) {
            // Đã có user (đăng ký bằng email), cập nhật googleId và avatar
            user.googleId = profile.id;
            // Chỉ cập nhật avatar nếu user chưa có avatar
            if (!user.avatar) {
                user.avatar = profile.photos[0].value; 
            }
            await user.save();
            return done(null, user);
        }

        // 3. Nếu không có gì, tạo user mới
        const newUser = new userModel({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            // Không cần password
        });

        await newUser.save();
        return done(null, newUser);

    } catch (error) {
        return done(error, false);
    }
}
));

export default passport;