import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";

passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        async function (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            cb: VerifyCallback
        ) {
            const foundUser = await prisma.account.findFirst({
                where: {
                    provider: "google",
                    providerId: profile.id,
                },
            });

            if (foundUser) {
                return cb(null, { id: foundUser.userId });
            } else {
                const base =
                    profile.displayName?.toLowerCase().replace(/\s+/g, "") ||
                    "user";
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                const user = await prisma.user.create({
                    data: {
                        username: base + randomSuffix,
                        displayName: profile.displayName,
                        email: profile.emails![0].value,
                    },
                });
                await prisma.account.create({
                    data: {
                        userId: user.id,
                        provider: "google",
                        providerId: profile.id,
                    },
                });
                return cb(null, user);
            }
        }
    )
);

passport.use(
    new LocalStrategy.Strategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async function (username, password, done) {
            try {
                console.log("made it to the passport-local handler");
                const foundUser = await prisma.user.findUnique({
                    where: { username },
                });
                if (!foundUser) return done(null, false);

                const credentialsInfo = await prisma.account.findFirst({
                    where: {
                        userId: foundUser.id,
                        provider: "credentials",
                    },
                });

                if (!credentialsInfo?.password) return done(null, false);

                const passwordResult = await bcrypt.compare(
                    password,
                    credentialsInfo.password
                );

                if (!passwordResult) return done(null, false);

                return done(null, { id: foundUser.id });
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser(function (
    user,
    cb: (err: any, user: Express.User) => void
) {
    process.nextTick(function () {
        cb(null, { id: user.id });
    });
});

passport.deserializeUser(function (user: Express.User, cb) {
    process.nextTick(async function () {
        const foundUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                accounts: true,
            },
        });
        return cb(null, foundUser);
    });
});
