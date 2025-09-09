const express = require("express");

const app = express();

// Request Handler
app.use("/test", (req, res) => {
  res.send("I'm listening on port 7777/test");
});

app.use("/hello", (req, res) => {
  res.send("I'm listening on port 7777/hello");
});

app.use("/", (req, res) => {
  res.send("I'm listening on port /");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
