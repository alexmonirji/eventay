const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const router = require("./router.js");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/../client/public/")));
app.use("/api/", router);

app.use(morgan("tiny"));

app.get("/*", function(req, res) {
  //React routes catch all method source: http://bit.ly/2DqrztT
  res.sendFile(path.join(__dirname, "/../client/public/index.html"), function(
    err
  ) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = 1337;
app.use("/", express.static(path.join(__dirname, "/../client/public/")));
app.use("/api/", router);
app.use(morgan("tiny"));

/* Start auth area!*/
var passport = require("passport");
var expressSession = require("express-session");
var LocalStrategy = require("passport-local").Strategy;

app.use(expressSession({ secret: "eventay" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport/login.js
passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, done) => {
      // check in mongo if a user with username exists or not
      User.findOne({ username: username }, function(err, user) {
        // In case of any error, return using the done method
        if (err) return done(err);
        // Username does not exist; log error & redirect back
        if (!user) {
          console.log("User Not Found with username " + username);
          return done(null, false, req.flash("message", "User Not found."));
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)) {
          console.log("Invalid Password");
          return done(null, false, req.flash("message", "Invalid Password"));
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user);
      });
    }
  )
);

/*End auth area!*/

const port = 1337;
app.listen(port, () => {
  console.log("Listening in port", port);
});
