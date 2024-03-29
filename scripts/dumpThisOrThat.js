const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
// const { MONGO_URL, MONGO_OPTIONS } = require("../src/global/config");
const ThisOrThatQuestionsModel = require("../src/mongo/models/ThisOrThatQuestions");
const logger = require("../src/global/logger");

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

async function processLineByLine() {
  // const url = "mongodb://localhost:27017/cheersly";

  // mongoose
  //   .connect(url, MONGO_OPTIONS)
  //   .then(() => logger.info("MongoDB Connected!!!"))
  //   .catch(err => logger.error("MongoDB Connection Failed -> error ", err));

  try {
    const fileStream = fs.createReadStream("./scripts/thisOrThat.txt");

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
      logger.debug(line);

      const thisQuestion = String(String(line).split(" or ")[0]).trim();
      const thatQuestion = capitalizeFirstLetter(
        String(String(line).split(" or ")[1]).trim()
      );

      const payload = {
        this: {
          id: nanoid(10),
          value: thisQuestion,
        },
        that: {
          id: nanoid(10),
          value: thatQuestion,
        },
      };

      await new ThisOrThatQuestionsModel(payload).save();
    }
  } catch (error) {
    logger.error(error);
  } finally {
    mongoose.disconnect();
  }
}

processLineByLine();
