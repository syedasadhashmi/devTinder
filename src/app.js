const express = require("express");

const app = express();

// Request Handler
// ("ab?c")=> it's used in which b is optional means ac,abc routes are entertain but the issue is it's absolute in newer versions of express
// app.get(["/abc", "/ac"], (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

// this is regex expression for multiple b can entertain in route starts with a between them b or bbbb but ends on c .

// app.get(/^\/ab+c$/, (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

// It can accept multiple bbbbb (ab+c)
// app.get(/^\/ab+c$/, (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

// /ac,/abc,/abbc
// app.get(/^\/ab*c$/, (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

// since only one bc allowed and bc is optional means only a can also entertain
// app.get(/^\/a(bc)?$/, (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

// this is a regex for the route containing a should only entertain
// app.get(/a/, (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

// The word should contain fly in last
// app.get(/.*fly$/, (req, res) => {
//   res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
// });

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Syed Asad", lastName: "Hashmi" });
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
