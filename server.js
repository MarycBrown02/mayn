
var express = require("express");
var app = express();
var passport = require("passport");
var passportConfig = require("./app/config/passport/passport");
var session = require("express-session");
var bodyParser = require("body-parser");
//var cookieParser = require("cookie-parser");
//var db = require("./app/models");
var env = require("dotenv").load();
var exphbs = require("express-handlebars");

SALT_WORK_FACTOR = 12;


//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// set the static directory for css, images, and js files to be served
app.use(express.static("public"));

// For Passport
//app.use(cookieParser);

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


//For Handlebars
app.set("views", "./app/views")
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// app.get('/', function (req, res) {
//     res.send('Welcome to Passport with Sequelize');
// });

//Models
var models = require("./app/models");

//Routes
//var authRoute = require('./app/routes/auth.js')(app, passport);
var apiRoutes = require("./app/routes/apiRoutes.js");
app.use(apiRoutes);
require("./app/routes/htmlRoutes.js")(app);

//load passport strategies
//require("./app/config/passport/passport.js")(passport, models.user);

//Sync Database
models.sequelize.sync().then(function () {
    console.log("Nice! Database looks fine");

}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
});


app.listen(3000, function (err) {
    if (!err)
        console.log("Site is live"); else console.log(err);

});

