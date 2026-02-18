import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const configurePassport = () => {
  // Serialize user for the session
  passport.serializeUser((user, done) => { // meaning of serializeUser is to decide which data of the user object should be stored in the session
    done(null, user.id); //done is a callback function provided by passport 
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with the same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.avatar = profile.photos[0]?.value || '';
            user.isEmailVerified = true;
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value || '',
            authProvider: 'google',
            isEmailVerified: true,
            phone: '0000000000', // Default phone, can be updated later
            role: 'customer', // Default role, can be updated
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export default passport;
