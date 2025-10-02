const express = require("express");

const { adminAuth, userAuth } = require("../src/middlewares/auth");

const connectDb = require("./config/database");

const app = express();

const User = require("./models/user");

const { validationSignUp } = require("./utils/validation");

const bcrypt = require("bcrypt");

app.use(express.json());

// SignUp
app.post("/signup", async (req, res) => {
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

    await user.save();
    res.send("user created succesfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req?.body;
    const isEmailValid = await User.findOne({ email: email });
    if (!isEmailValid) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      isEmailValid?.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      res.send("Login Successfully");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  console.log(userId);

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((e) => {
      // console.log(e);
      return ALLOWED_UPDATES.includes(e);
    });

    console.log(isUpdateAllowed);

    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed");
    }

    if (data?.skills?.length > 10) {
      throw new Error("ten skills were allowed");
    }

    if (data?.about) {
      const wordCount = data?.about?.trim().split(/\s+/)?.length;
      console.log(wordCount);

      if (wordCount > 250) {
        throw new Error("You can use 250 words only!");
      }
    }

    // if (data?.photoUrl) {
    //   const urlRegex = /^(https?:\/\/)([\w\-]+(\.[\w\-]+)+)(\/[^\s]*)?$/i;
    //   if (!urlRegex.test(data?.photoUrl)) {
    //     throw new Error("Photo url invalid must start with http or https");
    //   }
    // }

    const users = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!users) {
      res.status(404).send("User Not Found");
    } else {
      res.send("User Updated");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Find one via email

app.patch("/userEmail", async (req, res) => {
  const userEmail = req.body.email;
  const data = req.body;

  try {
    const users = await User.findOneAndUpdate({ email: userEmail }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(users);
    if (!users) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
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
