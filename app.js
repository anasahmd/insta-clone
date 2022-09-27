const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const like = require('./utils/like');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');
const formatDistanceToNowStrict = require('date-fns/formatDistanceToNowStrict');

const posts = require('./routes/posts');
const comments = require('./routes/comments');
const users = require('./routes/users');
const likes = require('./routes/likes');
const follow = require('./routes/follow');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/social-media')
  .then(() => {
    console.log('CONNECTION OPEN!!!');
  })
  .catch((err) => {
    console.log('OH NO ERROR!!!!');
    console.log(err);
  });

const sessionConfig = {
  secret: 'thisisnotagoodsecret',
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

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  res.locals.formatDistanceToNowStrict = formatDistanceToNowStrict;
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/p', posts);
app.use('/p/:id/comments', comments);
app.use('/', users);
app.use('/like', likes);
app.use('/follow', follow);

app.get('/', (req, res) => {
  res.redirect('/p');
});

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
