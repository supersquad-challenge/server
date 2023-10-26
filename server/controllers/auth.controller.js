const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserInfo = require('../models/userInfo.model');

require('dotenv').config();

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserInfo.findById(id);
    console.log('deserializeUser');

    done(null, user);
  } catch (err) {
    done(err);
  }
});

const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: 'https://supersquad.asia/auth/google/callback',
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await UserInfo.findOne({ googleId: profile.id });

      //console.log(existingUser);

      // console.log('accessToken', accessToken);
      // console.log('refreshToken', refreshToken);
      //console.log('profile', profile);
      // console.log('id_token', id_token);
      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = new UserInfo({
        email: profile.emails[0].value,
        googleId: profile.id,
        name: profile.displayName,
        nickname: '',
        picture: profile.photos[0].value,
        locale: profile._json.locale,
        isCookieAllowed: true,
        role: 'user',
        address: '',
      });
      const user = await newUser.save();
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

passport.use('google', googleStrategyConfig);
