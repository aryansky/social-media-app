import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
import { prisma } from "../utils/prisma";

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
        const user = await prisma.user.create({
          data: {
            username: profile.displayName,
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

// passport.use(
//   new LocalStrategy.Strategy(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );

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
    const foundUser = await prisma.user.findFirst({
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
