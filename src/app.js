const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
// const userAuth = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("Data base connected succeafully");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch(() => {
    console.log("Data base cannot be connected");
  });
