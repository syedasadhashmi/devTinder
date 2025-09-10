const express = require("express");

const { adminAuth, userAuth } = require("../src/middlewares/auth");

const app = express();

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("djsakj");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
  //

  // res.send("Data send");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
