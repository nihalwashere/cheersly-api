const express = require("express");
const { CronJob } = require("cron");
const { spawn } = require("child_process");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./src/global/logger");

const { PORT, MONGO_URL, MONGO_OPTIONS } = require("./src/global/config");
const { DEFAULT_TIME_ZONE } = require("./src/global/constants");

const PUBLIC_DIR = "src/public";

const app = express();

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({ verify: rawBodySaver, limit: "50mb" }));
app.use(
  express.urlencoded({ verify: rawBodySaver, extended: true, limit: "50mb" })
);
app.use(express.raw({ verify: rawBodySaver, type: "*/*", limit: "50mb" }));

const whitelist = [
  "https://www.cheersly.club",
  "https://dev.cheersly.club",
  "https://cheersly.club",
  "https://app.cheersly.club",
  "https://app-dev.cheersly.club",
  "http://localhost:7000",
  "https://localhost:3000",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) === -1) {
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin."
          ),
          false
        );
      }

      return callback(null, true);
    },
    exposedHeaders: "x-access-token",
  })
);

app.use(express.static(PUBLIC_DIR));

// ROUTES
const slackCommands = require("./src/api/v1/slack-commands");
const slackEvents = require("./src/api/v1/slack-events");
const slackActions = require("./src/api/v1/slack-actions");
const loadOptions = require("./src/api/v1/load-options");
const auth = require("./src/api/v1/auth");
const user = require("./src/api/v1/user");
const team = require("./src/api/v1/team");
const recognition = require("./src/api/v1/recognition");
const slackChannels = require("./src/api/v1/slack/channels");
const giftCards = require("./src/api/v1/gift-cards");
const billing = require("./src/api/v1/billing");
const test = require("./src/api/v1/test");

// USE ROUTES
app.use("/api/v1/slack-commands", slackCommands);
app.use("/api/v1/slack-events", slackEvents);
app.use("/api/v1/slack-actions", slackActions);
app.use("/api/v1/load-options", loadOptions);
app.use("/api/v1/slack/channels", slackChannels);
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/team", team);
app.use("/api/v1/recognition", recognition);
app.use("/api/v1/gift-cards", giftCards);
app.use("/api/v1/billing", billing);
app.use("/api/test", test);

// CONNECT TO MONGODB
mongoose
  .connect(MONGO_URL, MONGO_OPTIONS)
  .then(() => logger.info("MongoDB Connected!!!"))
  .catch(err => logger.error("MongoDB Connection Failed -> error ", err));

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/logo.png", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, PUBLIC_DIR, "logo.png"));
});

const server = app.listen(PORT, () => {
  try {
    logger.info(`App is now running on port ${PORT}!!!`);

    // polls cron scheduled every 5 mins
    // cron.schedule(
    //   "*/5 * * * *",
    //   () => {
    //     spawn(process.execPath, ["./src/cron/polls.js"], {
    //       stdio: "inherit",
    //   },
    //   {
    //     scheduled: true,
    //     timezone: DEFAULT_TIME_ZONE,
    //   }
    // );

    // upgrade trial subscription reminder cron scheduled at 12:00 PM daily
    new CronJob(
      "00 00 12 * * *",
      () => {
        spawn(process.execPath, ["./src/cron/upgrade-trial-subscription.js"], {
          stdio: "inherit",
        });
      },
      null,
      true,
      DEFAULT_TIME_ZONE
    );

    // upgrade trial with offer cron scheduled at 01:00 PM every thursday
    // cron.schedule(
    //   "00 13 * * 4",
    //   () => {
    //     spawn(process.execPath, ["./src/cron/upgrade-trial-with-offer.js"], {
    //       stdio: "inherit",
    //     });
    //   },
    //   {
    //     scheduled: true,
    //     timezone: DEFAULT_TIME_ZONE,
    //   }
    // );

    // NUDGES

    // allowance reloaded cron scheduled at 10:00 AM on the first of every month
    new CronJob(
      "00 00 10 1 * *",
      () => {
        spawn(process.execPath, ["./src/cron/allowance-reloaded.js"], {
          stdio: "inherit",
        });
      },
      null,
      true,
      DEFAULT_TIME_ZONE
    );

    // points about to expire cron scheduled at 10:00 AM on the 25th of every month
    new CronJob(
      "00 00 10 25 * *",
      () => {
        spawn(process.execPath, ["./src/cron/points-about-to-expire.js"], {
          stdio: "inherit",
        });
      },
      null,
      true,
      DEFAULT_TIME_ZONE
    );

    // inactivity reminders cron scheduled at 10:00 AM on the 15th of every month
    new CronJob(
      "00 00 10 15 * *",
      () => {
        spawn(process.execPath, ["./src/cron/inactivity-reminders.js"], {
          stdio: "inherit",
        });
      },
      null,
      true,
      DEFAULT_TIME_ZONE
    );

    // points available to redeem cron scheduled at 10:00 AM on the 10th of every month
    new CronJob(
      "00 00 10 10 * *",
      () => {
        spawn(process.execPath, ["./src/cron/points-available-to-redeem.js"], {
          stdio: "inherit",
        });
      },
      null,
      true,
      DEFAULT_TIME_ZONE
    );

    // EXCHANGE RATES

    // get exchange rates cron scheduled at 3 AM daily
    new CronJob(
      "00 00 3 * * *",
      () => {
        spawn(process.execPath, ["./src/cron/get-exchange-rates.js"], {
          stdio: "inherit",
        });
      },
      null,
      true,
      DEFAULT_TIME_ZONE
    );
  } catch (error) {
    logger.error("Failed to start server -> error : ", error);
  }
});

module.exports = { app, server };
