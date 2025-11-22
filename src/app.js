const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
// const userAuth = require("./middlewares/auth");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

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
