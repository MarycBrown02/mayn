var application = require("./application.js");

module.exports = function(app) {
  // loads index.html
  app.get("/", function (req, res) {
    res.render("index");
  });

  // loads main.html
  app.get("/main", function(req, res) {
    //res.sendFile(path.join(__dirname, "./pages/main.html"));
    res.render("main");
  });

  // loads meal.html
  app.get("/meal", function(req, res) {
    res.render("meal");
  });
};

// module.exports = router;
