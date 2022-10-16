if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/users');
const formatDistanceToNowStrict = require('date-fns/formatDistanceToNowStrict');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const posts = require('./routes/posts');
const comments = require('./routes/comments');
const users = require('./routes/users');
const likes = require('./routes/likes');
const follow = require('./routes/follow');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com',
  'https://kit.fontawesome.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://cdn.jsdelivr.net',
  'https://cdnjs.cloudflare.com',
  'https://fonts.googleapis.com',
  'https://use.fontawesome.com',
  'https://kit.fontawesome.com',
];
const fontSrcUrls = [
  'https://use.fontawesome.com',
  'https://cdn.jsdelivr.net',
  'https://cdnjs.cloudflare.com',
  'https://fonts.gstatic.com',
  'https://fonts.googleapis.com',
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", 'blob:'],
      scriptSrc: [
        "'unsafe-inline'",
        "'unsafe-eval'",
        "'self'",
        ...scriptSrcUrls,
      ],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ['blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dtq8oqzvj/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/social-media';

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('CONNECTION OPEN!!!');
  })
  .catch((err) => {
    console.log('OH NO ERROR!!!!');
    console.log(err);
  });

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

const sessionConfig = {
  name: 'instaCloneSession',
  secret,
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  res.locals.defaultDp = `https://res.cloudinary.com/dtq8oqzvj/image/upload/v1664818880/Don%27t%20Delete/instadefault_h1kqsb.jpg`;
  res.locals.formatDistanceToNowStrict = formatDistanceToNowStrict;
  res.locals.hostUrl = req.headers.host;
  res.set('Cache-Control', 'no-store');
  if (req.user) {
    const { notifications } = await User.findById(req.user._id).populate({
      path: 'notifications',
      populate: [{ path: 'sender', select: 'username dp' }, { path: 'refer' }],
      options: { sort: { createdAt: -1 } },
    });
    const newLikes = notifications.filter((notification) => {
      return !notification.isRead && notification.nType == 'like';
    });
    const newCommentLikes = notifications.filter((notification) => {
      return !notification.isRead && notification.nType == 'commentLike';
    });
    const newComments = notifications.filter((notification) => {
      return !notification.isRead && notification.nType == 'comment';
    });
    const newFollowers = notifications.filter((notification) => {
      return !notification.isRead && notification.nType == 'follow';
    });
    res.locals.newLikes = newLikes.length + newCommentLikes.length;
    res.locals.newComments = newComments.length;
    res.locals.newFollowers = newFollowers.length;
  }
  next();
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/p', posts);
app.use('/p/:id/comments', comments);
app.use('/like', likes);
app.use('/follow', follow);
app.use('/', users);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
