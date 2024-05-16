const passport = require ('passport');
const GoogleStrategy = require ('passport-google-oauth2').Strategy;
require ('dotenv').config ();
passport.use (
  new GoogleStrategy (
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5500/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // This is important for retrieving profile information
      hostedDomain: 'iiitdm.ac.in' ,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      done (null, profile);
    }
  )
);

passport.serializeUser ((user, done) => {
  done (null, user);
});

passport.deserializeUser ((user, done) => {
  done (null, user);
});