const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
const SAVE_DATA = "firstName,lastName,gender,age,about,skills,photUrl";

// Get all the pending connection request for the loggedIn User
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "skills",
      "about",
      "gender",
      "age",
    ]);
    res.json({ message: "Data Fetched Succesfully", data: connectionRequests });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Get All Connections (accepted) by  or off logged in user
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "about",
        "gender",
        "age",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "skills",
        "about",
        "gender",
        "age",
      ]);

    // const data = connectionRequests.map((row) => {
    //   if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
    //     return row._toUserId;
    //   }
    //   return row.fromUserId;
    // });
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data feteched Successfully",
      data,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
