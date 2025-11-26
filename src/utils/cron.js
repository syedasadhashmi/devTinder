const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

// This job is run 8am in the morning everyday
cron.schedule("1 8 * * *", async () => {
  // Send email to all people who got requests from previous day
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    // if there were millions of data this requiry become slow/expensive so do paggination so it will find out in bunshes
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");
    console.log(pendingRequests);

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.email)),
    ];

    // console.log(listOfEmails);
    // Sending email
    // if there were so many emails create queues for that or use pacakage bequeue or bullmq
    for (const email of listOfEmails) {
      try {
        // sendEmail is a function created for sending email using ses from aws with params subject and body
        const res = await sendEmail.run(
          "new friend request pending for " + email,
          "There are some friend request please login to syedasadhashmi.online to accept or reject it"
        );
        // console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
