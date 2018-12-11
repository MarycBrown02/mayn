var db = require("../models");

var passport = require("passport");

var express = require("express");

var router = express.Router();



router.post("/api/login", function (req, res) {

  console.log(req.body.email);
  console.log(req.body.password);

  db.User.find({ where: { email: req.body.email } }).then(function (user) {
    if (user) {

      // passport.authenticate("local"),
      //   function(req, res) {
      //     // If this function gets called, authentication was successful.
      //     // `req.user` contains the authenticated user.
      //     console.log("*** success");
      //     var resp = {
      //       success: true,
      //       failureMessage: ""
      //     };
      if (user.password === req.body.password) {
        req.session.user = user;
        res.json({ success: true, failureMessage: "" });
      } else {
        res.json({ success: false, failureMessage: "Invalid Email/Password" });
      }
    } else {
      res.json({ success: false, failureMessage: "Invalid Email/Password" });
    }
  });
});

router.get("/api/logout", function (req, res) {
  console.log("Ending session for: " + req.session.user.email);
  req.session.destroy();
  res.json({success: true});
 
});


router.post("/api/register", function (req, res) {
  db.User.find({ where: { email: req.body.email } }).then(function (user) {
    if (!user) {
      db.User.create(req.body).then(function(newUser){
        console.log("**** Registered user: " + newUser.email);
        req.session.user = newUser;
        req.session.save();
        res.json({ success: true, failureMessage: "" });
      }).error(function (err) {
        console.log(err);
      });
      // passport.authenticate("local"),
      //   function (req, res) {
      //     // If this function gets called, authentication was successful.
      //     // `req.user` contains the authenticated user.
      //     console.log("*** success");
      //     var resp = {
      //       success: true,
      //       failureMessage: ""
      //     };
      
    } else {
      var resp = {
        success: false,
        failureMessage: "Email already registered."
      };

      res.json(resp);
    }
  });

  //return the following json:
  // {
  //   success: true | false,
  //   failureMessage: <string>
  // }
});

router.post("/api/addFavorite", function (req, res) {
  // TODO: Insert into db
  // this route recieves:
  console.log("adding fav: " + req.body.name);
  console.log("adding fav for: " + req.session.user.email);

  req.body["UserId"] = req.session.user.id;
  console.log("userid: " + req.body.UserId);

  db.Favorite.create(req.body).error(function(err) {
    console.log(err);
  });
});

router.get("/api/getFavorites", function (req, res) {
  console.log("getting favs for user: " + req.session.uname);

  // TODO: get the favorites from the database for this user and return them.

  db.Favorite.findAll({
    where: {
      UserId: req.session.user.id

    }
  }).then(function(dbFavorite) {
    res.json(dbFavorite);
  });

  // var data = [
  //   {
  //     id: "Lasagna-2242363",
  //     name: "Lasagna",
  //     link: "https://bakeeatrepeat.ca/lasagna-recipe/",
  //     img: "https://lh3.googleusercontent.com/_o8naFCH3qpcDM4rGpzbp0yv0Edx1PGHCDdnPRfseU428QUDMRE4xA6IiNH--VTQ6JTBjHeFxmObcNeKXwrof14=s90-c"
  //   },
  //   {
  //     id: "Easy-beef-lasagna-_featuring-ragu-2-lb_-13-oz_-jar_-298898",
  //     name: "Easy Beef Lasagna (featuring Ragu 2 Lb. 13 Oz. Jar)",
  //     link: "http://www.yummly.co/recipe/Easy-beef-lasagna-_featuring-ragu-2-lb_-13-oz_-jar_-298898",
  //     img: "http://lh5.ggpht.com/OB-_2MoQJK5l_ODL0M1DxCfXhNM-KFjT6n1EGe7sUQwtH1486EKGEcJLW6Sr9INDWwmS0fP3LOWSQ8d1sBx2fw=s90-c"
  //   }

  // ];
  // res.json(data);
});



module.exports = router;
