const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { updateValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

// Get Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    updateValidation(req);
    const loggedInUser = req.user;
    // loggedInUser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated Successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Edit Password (Forgot Password)
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPreviousPasswordValid = user.verifyPSWD(req.body.password);
    if (!isPreviousPasswordValid) {
      throw new Error("Previous Password is not valid!");
    }
    const isNewPSWD = validator.isStrongPassword(req.body.newPassword);
    const newPSWD = req.body.newPassword;

    console.log("newPSWD", req.body.newPSWD);
    if (!isNewPSWD) {
      throw new Error("Your Password is not strong: " + req.body.newPassword);
    }
    // const newPSWD = req.body.newPassword;
    const hashNewPSWD = await bcrypt.hash(newPSWD, 10);
    // console.log("hashNewPSWD", hashNewPSWD);
    // console.log("req.user.password", req.user.password);
    user.password = hashNewPSWD;
    // console.log("Again--->req.user.password", req.user.password);

    await user.save();
    res.send("Password Changes successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
