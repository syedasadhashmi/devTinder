const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationSignUp } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  // creating a new instance of user Model

  try {
    // validation
    validationSignUp(req);

    //Encript the password
    const { password, email, firstName, lastName } = req?.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating new instance of the user model
    const user = new User({
      email,
      firstName,
      lastName,
      password: passwordHash,
    });
    const data = await user.save();

    const token = await data.getJWT();
    // Add a token to cookie and send the response back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "user created succesfully", data: data });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req?.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.verifyPSWD(password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();
      // Add a token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json({ message: "Login Successfully", data: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie(
    "token",
    {},
    {
      expires: new Date(Date.now()),
    }
  );
  res.send("Logout Succesfull!!");
});

module.exports = authRouter;
