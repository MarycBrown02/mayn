//load bcrypt
var bCrypt = require("bcrypt-nodejs");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require("../../models");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  db.User.find({ where: { id: user.id } }).success(function (user) {
    done(null, user);
  }).error(function (err) {
    done(err, null);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (username, password, done) {
    console.log("auth called");
    db.User.find({ where: { email: username } }).success(function (user) {
      passwd = user ? user.password : "";
      isMatch = db.User.validPassword(password, passwd, done, user)
    });
  }
));


// module.exports = function (passport, user) {

//   var User = user;
//   var LocalStrategy = require("passport-local").Strategy;


//   passport.serializeUser(function (user, done) {
//     done(null, user);
//   });


//   // used to deserialize the user
//   passport.deserializeUser(function (user, done) {
//     User.findById(id).then(function (user) {
//       if (user) {
//         done(null, user.get());
//       }
//       else {
//         done(user.errors, null);
//       }
//     });

//   });


//   passport.use("local-signup", new LocalStrategy(

//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true // allows us to pass back the entire request to the callback
//     },

//     function (req, email, password, done) {


//       var generateHash = function (password) {
//         return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
//       };

//       User.findOne({ where: { email: email } }).then(function (user) {

//         if (user) {
//           console.log(null, false, { message: "That email is already taken" });
//           return done(null, false, { message: "That email is already taken" });
//         }

//         else {
//           var userPassword = generateHash(password);
//           var data =
//           {
//             email: email,
//             password: userPassword,
//             firstname: req.body.firstName,
//             lastname: req.body.lastName
//           };


//           User.create(data).then(function (newUser, created) {
//             if (!newUser) {
//               return done(null, false);
//             }

//             if (newUser) {
//               return done(null, newUser);

//             }


//           });
//         }


//       });



//     }



//   ));

//   //LOCAL SIGNIN
//   passport.use("local-signin", new LocalStrategy(

//     {

//       // by default, local strategy uses username and password, we will override with email
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true // allows us to pass back the entire request to the callback
//     },

//     function (req, email, password, done) {

//       var User = user;

//       var isValidPassword = function (userpass, password) {
//         return bCrypt.compareSync(password, userpass);
//       }

//       User.findOne({ where: { email: email } }).then(function (user) {

//         if (!user) {
//           return done(null, false, { message: "Email does not exist" });
//         }

//         if (!isValidPassword(user.password, password)) {

//           return done(null, false, { message: "Incorrect password." });

//         }

//         var userinfo = user.get();

//         return done(null, userinfo);

//       }).catch(function (err) {

//         console.log("Error:", err);

//         return done(null, false, { message: "Something went wrong with your Signin" });


//       });

//     }
//   ));

// }
