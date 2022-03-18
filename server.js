const express = require("express");
// const { CronJob } = require("cron");
// const { spawn } = require("child_process");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/graphql/schema");
const logger = require("./src/global/logger");

const { PORT, MONGO_URL, MONGO_OPTIONS } = require("./src/global/config");
// const { DEFAULT_TIME_ZONE } = require("./src/global/constants");

const PUBLIC_DIR = "src/public";

const app = express();

app.use(morgan("combined"));

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
  "https://cheersly-dev.herokuapp.com",
  "https://cheersly.herokuapp.com",
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
const users = require("./src/api/v1/users");
const recognition = require("./src/api/v1/recognition");
const slackChannels = require("./src/api/v1/slack/channels");
const catalogs = require("./src/api/v1/catalogs");
const teams = require("./src/api/v1/teams");
const test = require("./src/api/v1/test");

// USE ROUTES
app.use("/api/v1/slack-commands", slackCommands);
app.use("/api/v1/slack-events", slackEvents);
app.use("/api/v1/slack-actions", slackActions);
app.use("/api/v1/load-options", loadOptions);
app.use("/api/v1/slack/channels", slackChannels);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/recognition", recognition);
app.use("/api/v1/catalogs", catalogs);
app.use("/api/v1/teams", teams);
app.use("/api/test", test);

// GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
    pretty: true,
  })
);

// CONNECT TO MONGODB
mongoose
  .connect(MONGO_URL, MONGO_OPTIONS)
  .then(() => logger.info("MongoDB Connected!!!"))
  .catch(err => logger.error("MongoDB Connection Failed -> error ", err));

app.get("/logo.png", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, PUBLIC_DIR, "logo.png"));
});

app.get("/giphy_attribution_mark.png", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, PUBLIC_DIR, "giphy_attribution_mark.png"));
});

const server = app.listen(PORT, () => {
  try {
    logger.info(`App is now running on port ${PORT}!!!`);

    // polls cron scheduled every 5 mins
    // new CronJob(
    //   "00 */5 * * * *",
    //   () => {
    //     spawn(process.execPath, ["./src/cron/polls.js"], {
    //       stdio: "inherit",
    //     });
    //   },
    //   null,
    //   true,
    //   DEFAULT_TIME_ZONE
    // );

    // // upgrade trial subscription reminder cron scheduled at 12:00 PM daily
    // new CronJob(
    //   "00 00 12 * * *",
    //   () => {
    //     spawn(
    //       process.execPath,
    //       ["./src/cron/upgrade-trial-subscription/index.js"],
    //       {
    //         stdio: "inherit"
    //       }
    //     );
    //   },
    //   null,
    //   true,
    //   DEFAULT_TIME_ZONE
    // );
  } catch (error) {
    logger.error("Failed to start server -> error : ", error);
  }
});

module.exports = { app, server };
