const express = require("express");

const { adminAuth, userAuth } = require("../src/middlewares/auth");

const app = express();

// Multiple Route Handler
app.use("/admin", adminAuth);

app.use("/user/data", userAuth);

app.get("/admin/data", (req, res) => {
  res.send("Admin is here!  ");
});

app.get("/user/data", (req, res) => {
  res.send("user is here!  ");
});

app.get("/user/login", (req, res) => {
  res.send("Login");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
