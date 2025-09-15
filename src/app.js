const express = require("express");

const { adminAuth, userAuth } = require("../src/middlewares/auth");

const connectDb = require("./config/database");

const app = express();

const User = require("./models/user");

app.use(express.json());

// SignUp
app.post("/signup", async (req, res) => {
  // creating a new instance of user Model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user created succesfully");
  } catch (err) {
    res.status(400).send("Error saving the user ", err.message);
  }
});

// Get user By Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  console.log(userEmail);
  try {
    //It fetches the oldest one
    const users = await User.findOne({
      email: userEmail,
    });
    if (!users) {
      res.status(404).send("Record Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Get all users for feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("Record Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Get By ID
app.get("/findById", async (req, res) => {
  const userId = req.body._id;

  try {
    const users = await User.findById(userId);
    if (!users) {
      res.status(404).send("Record Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  // console.log(users);

  try {
    const users = await User.findByIdAndDelete(userId);
    if (!users) {
      res.status(404).send("No User Found");
    } else {
      res.send("User Deleted");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Find one via id
app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;

  try {
    const users = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    if (!users) {
      res.status(404).send("User Not Found");
    } else {
      res.send("User Updated");
    }
  } catch (err) {
    res.send(400).send("Something went wrong");
  }
});

// Find one via email

app.patch("/userEmail", async (req, res) => {
  const userEmail = req.body.email;
  const data = req.body;

  try {
    const users = await User.findOneAndUpdate({ email: userEmail }, data, {
      returnDocument: "after",
    });
    console.log(users);
    if (!users) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send(400).send("Something went wrong");
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
    console.log("Data base cannot be connected");
  });
