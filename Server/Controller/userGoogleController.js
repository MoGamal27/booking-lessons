const { google } = require('googleapis');
const UserGoogle = require('../Model/userGoogleModel');

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes for Google Calendar and user info
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

exports.googleAuth = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // This ensures we always get a refresh token
  });
  res.redirect(authUrl);
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Find or create user
    let user = await UserGoogle.findOne({ where: { googleId: data.id } });
    if (!user) {
      user = await UserGoogle.create({
        googleId: data.id,
        email: data.email,
        name: data.name,
        googleToken: tokens.access_token
      });
    } else {
      // Update user's Google token
      user.googleToken = tokens.access_token;
      await user.save();
    }

    res.redirect('/auth-success');
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};


