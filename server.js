require('dotenv').config();
const session = require('express-session');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 4000;
const userRoutes = express.Router();
const TWO_HOURS = 1000 * 60 * 60 * 2;
const SESS_LIFETIME = TWO_HOURS;
const SESS_NAME = 'sidd';
const SESS_SECRET = 'cookiesecret123';
const MongoStore = require('connect-mongo')(session);
const NODE_ENV = 'development';
const IN_PROD = NODE_ENV === 'production';

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(bodyParser.json());

let User = require('./userModel');

mongoose.connect(
  process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/users',
  { useNewUrlParser: true }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Mongo DB Connection Est. Yay!!');
});

// ROUTES

userRoutes.route('/').get((req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.json({ data: 'LOGIN' });
  } else {
    console.log(userId);
    res.json({
      data: 'LOGGEDIN',
      user: req.session.user,
      userId: userId
    });
  }
});

userRoutes.route('/login').post((req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.json(err);
    }
    if (!user) {
      console.log('Not Found');
      res.json({ data: 'NOTFOUND' });
    } else if (user && user.password === req.body.password) {
      console.log('PASS');
      req.session.userId = user._id;
      req.session.user = user;
      req.session.save(() => {
        res.json({ data: 'PASS', user: user, sessionID: req.session.id });
      });
    } else {
      console.log('Credentials wrong');
      res.json({ data: 'INVALID' });
    }
  });
});

userRoutes.route('/createuser').post((req, res) => {
  // console.log(req.body);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.status(200).json({ data: 'User Already Present' });
    } else {
      let user = new User(req.body);
      user
        .save()
        .then(user => {
          res.status(200).json({ data: 'user Added' });
        })
        .catch(err => {
          res.status(400).send('Adding Failed', err);
        });
      console.log('User Created');
    }
  });
});

// Send all Users

userRoutes.route('/getUserList').get((req, res) => {
  User.find({}, (err, users) => {
    let userMap = [];
    users.forEach(user => {
      if (user._id != req.session.userId) {
        let { name, profilepic, _id } = user;
        userMap.push({ name, profilepic, _id });
      }
    });
    res.json({ data: userMap });
  });
});

// Show User Profile

userRoutes.route('/getUser/:id').get((req, res) => {
  User.findById(req.params.id, (err, user) => {
    let { name, profilepic, watchlist, friendlist, wishlist } = user;
    res.json({
      data: { name, profilepic, watchlist, friendlist, wishlist }
    });
  });
});

userRoutes.route('/deleteWatchList').post((req, res) => {
  let userId = req.session.userId;
  let movie = req.body;
  User.findById(userId, (err, user) => {
    // console.log(userId, user);
    let index = user.watchlist.findIndex(x => x.id === movie.id);
    if (index === -1) {
      res.json({ data: 'NOT IN WATCHLIST' });
    } else {
      user.watchlist.splice(index, 1);
      user.save();
      req.session.user = user;
      console.log('DELETED');
      res.json({
        data: 'DELETED'
      });
    }
  });
});

userRoutes.route('/addToWatchList').post((req, res) => {
  let userId = req.session.userId;
  // console.log('OUTPUT: : userId', userId);
  if (userId) {
    let movie = req.body;
    // console.log('OUTPUT: : movie', movie);
    User.findById(userId, (err, user) => {
      if (
        !user.watchlist.some(function(id) {
          return id.id === movie.id;
        })
      ) {
        user.watchlist.push(movie);
        user.save();
        req.session.user = user;
        console.log('ADDED');
        res.status(200).json({ data: 'Movie Added' });
      } else {
        req.session.user = user;
        res.json({
          data: 'Movie Already Present'
        });
      }
    });
  } else {
    res.json({ data: 'LOGIN FIRST' });
  }
});

mongoose.set('useFindAndModify', false);
userRoutes.route('/addRating').put((req, res) => {
  let userId = req.session.userId;
  let movie = req.body;
  console.log(movie);
  if (userId) {
    User.findOneAndUpdate(
      { _id: userId, 'watchlist.id': movie.id },
      { $set: { 'watchlist.$.rating': movie.rating } },
      { new: true },
      function(error, success) {
        if (error) throw error;
        req.session.user = success;
        // console.log(success.watchlist);
        res.json({
          data: 'Rating Updated',
          user: success
        });
      }
    );
  } else {
    console.log('Login Please');
  }
});

userRoutes.route('/getRating').post((req, res) => {
  let userId = req.session.userId;
  if (userId) {
    let movie = req.body;
    res.json({
      data: req.session.user.watchlist.find(id => id.id === movie.id.toString())
        .rating
    });
  } else {
    console.log('Login Please');
  }
});

userRoutes.route('/getFriendList').get((req, res) => {
  let userId = req.session.userId;
  if (userId) {
    res.status(200).json({ data: req.session.user.friendlist });
  } else {
    console.log('No Session active');
  }
});

userRoutes.route('/getWatchList').get((req, res) => {
  let userId = req.session.userId;
  if (userId) {
    User.findById(userId, (err, user) => {
      res.status(200).json({ data: user.watchlist });
    });
  } else {
    console.log('No Session active');
  }
});

userRoutes.route('/addToFriendList').post((req, res) => {
  let userId = req.session.userId;
  if (userId) {
    let friend = req.body;
    User.findById(userId, (err, user) => {
      if (
        !user.friendlist.some(function(id) {
          return id.id === friend.id;
        })
      ) {
        user.friendlist.push(friend);
        user.save();
        req.session.user = user;
        console.log('ADDED Friend');
        res.status(200).json({ data: 'Friend Added' });
      } else {
        req.session.user = user;
        res.json({
          data: 'Friend Already Present'
        });
      }
    });
  } else {
    console.log('No Session active');
  }
});

userRoutes.route('/deleteFromFriendList').post((req, res) => {
  let userId = req.session.userId;
  let friend = req.body;
  User.findById(userId, (err, user) => {
    // console.log(userId, user);
    let index = user.friendlist.findIndex(x => x.id === friend.id);
    if (index === -1) {
      res.json({ data: 'NOT IN WATCHLIST' });
    } else {
      user.friendlist.splice(index, 1);
      user.save();
      req.session.user = user;
      console.log('DELETED FRIEND');
      res.json({
        data: 'DELETED Friend'
      });
    }
  });
});

userRoutes.route('/logout').get((req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.json({ data: 'ERR' });
    }
    res.clearCookie(SESS_NAME);
    res.json({ data: 'LOGIN' });
  });
});

app.use(
  session({
    name: SESS_NAME,
    resave: true,
    saveUninitialized: false,
    secret: SESS_SECRET,
    store: new MongoStore({ mongooseConnection: connection }),
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
    }
  })
);
app.use('/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Started @ ${port}`);
});
