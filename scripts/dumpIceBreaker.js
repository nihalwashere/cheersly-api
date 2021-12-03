const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
// const { MONGO_URL, MONGO_OPTIONS } = require("../src/global/config");
const IceBreakerQuestionsModel = require("../src/mongo/models/IceBreakerQuestions");
const logger = require("../src/global/logger");

async function processLineByLine() {
  // const url = "mongodb://localhost:27017/cheersly";

  // mongoose
  //   .connect(url, MONGO_OPTIONS)
  //   .then(() => logger.info("MongoDB Connected!!!"))
  //   .catch(err => logger.error("MongoDB Connection Failed -> error ", err));

  try {
    const fileStream = fs.createReadStream("./scripts/iceBreaker.txt");

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
      logger.debug(line);

      const question = String(line).trim();

      await new IceBreakerQuestionsModel({ question }).save();
    }
  } catch (error) {
    logger.error(error);
  } finally {
    mongoose.disconnect();
  }
}

processLineByLine();
