const express = require("express");

const app = express();

// Request Handler
app.get("/user", (req, res) => {
  res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
});

app.post("/user", (req, res) => {
  res.send("Data Saved to DB Successfully");
});

app.delete("/user", (req, res) => {
  res.send("User data deleted");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
