const express = require("express");

const { adminAuth, userAuth } = require("../src/middlewares/auth");

const connectDb = require("./config/database");

const app = express();

connectDb()
  .then(() => {
    console.log("Data base connected succeafully");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch(() => {
    console.log("Data base cannot be connexted");
  });
