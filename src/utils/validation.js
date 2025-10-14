const validator = require("validator");

const validationSignUp = (req) => {
  const { email, firstName, lastName, password, skills, about } = req?.body;

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (skills?.length > 10) {
    throw new Error("ten skills were allowed");
  } else if (about) {
    const wordCount = about?.trim()?.split(/\s+/)?.length;
    console.log(wordCount);
    if (wordCount > 250) {
      throw new Error("You can use 250 words only!");
    }
  }
};

const updateValidation = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photoUrl",
    "skills",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Not A Valid Field to Update");
  }

  return isEditAllowed;
};

module.exports = {
  validationSignUp,
  updateValidation,
};
