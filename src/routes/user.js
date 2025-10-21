const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
const SAVE_DATA = "firstName lastName gender age about skills photUrl";
const User = require("../models/user");

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
      "photoUrl",
    ]);
    res.json({ message: "Data Fetched Succesfully", data: connectionRequests });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Get All Connections (accepted) by  or off logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
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
        "photoUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "skills",
        "about",
        "gender",
        "age",
        "photoUrl",
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

// Gets you the profiles of other users on platform
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectedUsers = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();
    connectedUsers.forEach((req) => {
      hideUsers.add(req.fromUserId.toString());
      hideUsers.add(req.toUserId.toString());
    });

    const shownUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAVE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Data Fetched Successfully", data: shownUsers });
  } catch (err) {
    res.status(400).send({ message: "Error: " + err.message });
  }
});

module.exports = userRouter;
