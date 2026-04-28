import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import { prisma } from '../config/prisma.js';

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
            let user = await prisma.user.findUnique({
                where: { googleId: profile.id }
            });

            if (user) {
                return done(null, user); // Đã có, cho đăng nhập
            }

            // 2. Nếu chưa có googleId, kiểm tra xem email đã tồn tại chưa
            user = await prisma.user.findUnique({
                where: { email: profile.emails[0].value }
            });

            if (user) {
                const updatedUser = await prisma.user.update({
                    where: {id: user.id},
                    data: {
                        googleId: profile.id,
                        avatar: user.avatar || profile.photos[0].value
                    }
                });
                return done(null, updatedUser);
            }

            // 3. Nếu không có gì, tạo user mới
            const newUser = await prisma.user.create({
                data: {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                }
            });

            return done(null, newUser);

        } catch (error) {
            return done(error, false);
        }
    }
));

export default passport;