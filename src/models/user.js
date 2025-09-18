const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address: " + value);
        }
      },
      // validate: (value) => {
      //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //   if (!regex.test(value)) {
      //     throw new Error("Email is not valid");
      //   }
      // },
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender value is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 150,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw24aljgwuo5ukvRcwenz_aH&ust=1758034592350000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPixuLOD248DFQAAAAAdAAAAABAE",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is a sample about!",
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your Password is not strong: " + value);
        }
      },
      // validate: (value) => {
      //   const regex =
      //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      //       value
      //     );
      //   if (!regex) {
      //     throw new Error(
      //       "Password must be at least 8 characters long and include at least one lowercase, one uppercase, one number, and one special character."
      //     );
      //   }
      // },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
