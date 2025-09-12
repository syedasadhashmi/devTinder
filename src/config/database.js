const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://namasteDev:cozYOK0t3TfBDWZA@namastenode.swrykeh.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
