var db = require("../models");
var express = require("express");

var router = express.Router();



router.post("/api/login", function (req, res) {

  console.log(req.body.email);
  console.log(req.body.password);

  db.User.find({ where: { email: req.body.email } }).then(function(user) {
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
        return res.json({ success: true, failureMessage: "" });
      } else {
        return res.json({ success: false, failureMessage: "Invalid Email/Password" });
      }
    } else {
      return res.json({ success: false, failureMessage: "Invalid Email/Password" });
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

router.get("/api/getFavorites", function(req, res) {
  console.log("getting favs for user: " + req.session.user.email);

  db.Favorite.findAll({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(dbFavorite) {
    res.json(dbFavorite);
  });

});

router.get("/api/getMeals", function (req, res) {
  console.log("getting meals for user: " + req.session.email);

  db.Meals.findAll({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(dbMeals) {
    res.json(dbMeals);
  });

});

router.post("/api/updateMeals", function(req, res) {

  db.Meals.find({where: {UserId: req.session.user.id}}).then(function(dbMeals){
    if(dbMeals) {
      db.Meals.update(req.body,
        {
          where: {
            UserId: req.session.user.id
          }
        })
        .then(function(dbPost) {
          res.json(dbMeals);
        });
    } else {
      // add user id to the body of request so we can pass to model object for insert
      req.body["UserId"] = req.session.user.id;
      db.Meals.create(req.body).then(function(dbMeals) {
        res.json({success: true, failureMessage: ""});
      }).error(function(err) {
        console.log(err);
        res.json(dbMeals);
      });
    }
  });
});

module.exports = router;
