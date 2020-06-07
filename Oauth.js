const GoogleStartgy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (passport) => {
  passport.use(
    new GoogleStartgy(
      {
        clientID: process.env.ClientID,
        clientSecret: process.env.ClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);
        const newUser = {
          googleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        User.findOne({
          googleID: profile.id,
        }).then((user) => {
          if (user) {
            done(null, user);
          } else {
            new User(newUser).save().then((user) => done(null, user));
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => done(null, user));
  });
};
