const express = require("express");

const app = express();

// Multiple Route Handler
app.use(
  "/user",
  [
    (req, res, next) => {
      console.log("Console Route Handler 1");
      // res.send("Route Handler 1");
      next();
    },
    (req, res, next) => {
      console.log("Console Route Handler 2");
      // res.send("Route handler 2");
      next();
    },
  ],
  (req, res) => {
    console.log("Third HAndler");
    res.send("3rd Handler ");
  }
);

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
