const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login");
    }
    //Validate token
    const decodedToken = await jwt.verify(token, process.env.SECRET_JWT);
    // find user
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    // tthe user object will attach with req so we can took that object and use in our other apis
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

// const adminAuth = (req, res, next) => {
//   console.log("Admin Auth called!");
//   const token = "xyz1";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized Request");
//   } else {
//     next();
//   }
// };

// const userAuth = (req, res, next) => {
//   console.log("user Auth called!");
//   const token = "xyz";
//   const isUserAuthorized = token === "xyz";
//   if (!isUserAuthorized) {
//     res.status(401).send("Unauthorized Request");
//   } else {
//     next();
//   }
// };

module.exports = { userAuth };
