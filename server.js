const express = require("express");
// const { CronJob } = require("cron");
// const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./src/global/logger");

// ENV PORT
const { PORT, MONGO_URL } = require("./src/global/config");

const PUBLIC_DIR = "src/public";

const app = express();

app.use(morgan("combined"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const whitelist = [
  "https://app.codekickbot.com",
  "https://www.codekickbot.com",
  "https://codekickbot.com",
  "https://codekickbot-dev.herokuapp.com",
  "https://dev.codekickbot.com",
  "https://app-dev.codekickbot.com",
  "http://localhost:7000",
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
  })
);

app.use(express.static(PUBLIC_DIR));

// ROUTES
const test = require("./src/api/v1/test");

// USE ROUTES
app.use("/api/test", test);

// CONNECT TO MONGODB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info("MongoDB Connected!!!"))
  .catch((err) => logger.error("MongoDB Connection Failed -> error ", err));

app.get("/contact", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, PUBLIC_DIR, "index.html"));
});

app.get("/tos", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, PUBLIC_DIR, "index.html"));
});

const server = app.listen(PORT, () => {
  try {
    logger.info(`App is now running on port ${PORT}!!!`);
  } catch (error) {
    logger.error("Failed to start server -> error : ", error);
  }
});

module.exports = { app, server };
