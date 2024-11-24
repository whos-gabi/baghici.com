// index.js
const express = require('express');
const app = express();
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

// Initialize i18next
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/translation.json'),
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ro', 'ru'],
    preload: ['en', 'ro', 'ru'],
    detection: {
      order: ['path', 'querystring', 'cookie', 'header'],
      lookupPath: 'lng',
      caches: false,
    },    
    nonExplicitSupportedLngs: true,
    debug: false, // Set to true for debugging
  });

// Middleware to handle i18next
app.use(i18nextMiddleware.handle(i18next));

// Set up view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to pass t and lng to templates
app.use((req, res, next) => {
  res.locals.t = req.t;
  res.locals.lng = req.language;
  next();
});

// Routes
app.get('/:lng(en|ro|ru)?/', (req, res) => {
  const lng = req.params.lng || 'en';
  res.render('index', { req, path: 'pages/home', lng });
});

app.get('/:lng(en|ro|ru)/getintouch', (req, res) => {
  const lng = req.params.lng || 'en';
  res.render('index', { req, path: 'pages/getintouch', lng });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
