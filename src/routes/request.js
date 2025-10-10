const exprees = require("express");
const requestRouter = exprees.Router();
const { userAuth } = require("../middlewares/auth");

// Send Connection Request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + "send you a connection request!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
