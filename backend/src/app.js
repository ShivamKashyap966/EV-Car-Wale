const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { env } = require('./config/env');
const apiRoutes = require('./routes');
const chargerRoutes = require('./routes/chargerRoutes');
const { requestLogger } = require('./middleware/requestLogger');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

// Configure Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8081/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const user = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
      picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
    };
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function createApp(options = {}) {
  const app = express();
  const frontendRoot = options.frontendRoot || path.join(__dirname, '..', '..');

  app.use(cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Configure Session Middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'evcarwale_default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  // Initialize Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(requestLogger);

  app.use('/api', apiRoutes(options));
  app.use('/api/chargers', chargerRoutes);

  // Google OAuth Auth Routes
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (req.session) {
        req.session.destroy((err2) => {
          res.clearCookie('connect.sid');
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.json({
        loggedIn: true,
        user: {
          name: req.user.name,
          email: req.user.email,
          picture: req.user.picture
        }
      });
    } else {
      res.json({
        loggedIn: false
      });
    }
  });
  const fs = require('fs');

  // Intercept app.js to inject environment variables
  app.get('/app.js', (req, res) => {
    try {
      let content = fs.readFileSync(path.join(frontendRoot, 'app.js'), 'utf8');
      const s3Url = process.env.VITE_S3_BASE_URL || process.env.AWS_S3_PUBLIC_BASE_URL || 'https://ev-car-wale.s3.ap-south-1.amazonaws.com';
      content = content.replace(/'https:\/\/ev-car-wale\.s3\.ap-south-1\.amazonaws\.com'/g, JSON.stringify(s3Url));
      res.type('application/javascript').send(content);
    } catch (err) {
      res.status(500).send('Error loading app.js');
    }
  });

  // Route alias for navbar-logo.png to support both nav bar logo.png and navbar-logo.png
  app.get('/navbar-logo.png', (req, res) => {
    res.sendFile(path.join(frontendRoot, 'nav bar logo.png'));
  });

  // Serve local vehicle images and brand logos if available, otherwise redirect to S3
  app.get(/^\/(LOGOS|public\/car_images|car_images)\/(.+)$/i, (req, res) => {
    let cleanPath = req.path;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    // 1. Direct file check
    const localFile = path.join(frontendRoot, cleanPath);
    if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
      return res.sendFile(localFile);
    }

    // 2. Case-insensitive local file check
    const dirPath = path.dirname(localFile);
    const targetBase = path.basename(localFile).toLowerCase();
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath);
      const matched = files.find(f => f.toLowerCase() === targetBase || f.toLowerCase().replace(/\.[^/.]+$/, '') === targetBase.replace(/\.[^/.]+$/, ''));
      if (matched) {
        return res.sendFile(path.join(dirPath, matched));
      }
    }

    // 3. Fallback to S3 bucket redirect
    const s3BaseUrl = process.env.VITE_S3_BASE_URL || process.env.AWS_S3_PUBLIC_BASE_URL || 'https://ev-car-wale.s3.ap-south-1.amazonaws.com';
    res.redirect(`${s3BaseUrl}/${cleanPath}`);
  });

  // Inject API key into index.html
  function injectMapsKeyIntoHtml(req, res) {
    try {
      let content = fs.readFileSync(path.join(frontendRoot, 'index.html'), 'utf8');
      const mapsKey = process.env.GOOGLE_MAPS_API_KEY || env.GOOGLE_MAPS_API_KEY || '';
      content = content.replace(/__GOOGLE_MAPS_API_KEY__/g, mapsKey);
      res.type('text/html').send(content);
    } catch (err) {
      res.status(500).send('Error loading index.html');
    }
  }
  app.get('/index.html', injectMapsKeyIntoHtml);
  app.get('/', injectMapsKeyIntoHtml);

  // Route aliases for /insights/ pages
  app.use('/insights', (req, res, next) => {
    let p = req.path;
    if (p === '/where-electricity-comes-from.html' || p === '/where-electricity-comes-from') {
      return res.sendFile(path.join(frontendRoot, 'insights', 'where-does-electricity-come-from.html'));
    }
    if (!p.endsWith('.html') && p !== '/') {
      const targetFile = path.join(frontendRoot, 'insights', p + '.html');
      if (fs.existsSync(targetFile)) {
        return res.sendFile(targetFile);
      }
    }
    next();
  });

  app.use(express.static(path.join(frontendRoot, 'public')));
  app.use(express.static(frontendRoot));

  app.get(/^(?!\/(api|insights|insights_images|everything_u_need|car_images|LOGOS)).*$/, (req, res, next) => {
    if (req.path.includes('.')) return next();
    injectMapsKeyIntoHtml(req, res);
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
