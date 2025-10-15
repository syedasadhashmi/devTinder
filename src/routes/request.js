const exprees = require("express");
const requestRouter = exprees.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Send Connection Request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStauses = ["ignored", "interested"];
      // Status check
      if (!allowedStauses.includes(status)) {
        return res.status(400).json({ message: "Invalid Status Type" });
      }

      // toUser available
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }
      // Check connection request
      const isConnectionAvaialable = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isConnectionAvaialable) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exist" });
      }
      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + "in" + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
