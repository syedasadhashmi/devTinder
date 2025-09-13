const express = require("express");

const { adminAuth, userAuth } = require("../src/middlewares/auth");

const connectDb = require("./config/database");

const app = express();

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // creating a new instance of user Model
  const user = new User({
    firstName: "Syed Asad",
    lastName: "Hashmi",
    email: "asadhashmi@gmai.com",
    password: "asad@123",
    gender: "male",
    age: 28,
  });

  try {
    await user.save();
    res.send("user created succesfully");
  } catch (err) {
    res.status(400).send("Error saving the user ", err.message);
  }
});

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
