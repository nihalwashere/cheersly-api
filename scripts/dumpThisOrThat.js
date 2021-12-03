const fs = require("fs");
const readline = require("readline");
const { MongoClient } = require("mongodb");
const { nanoid } = require("nanoid");
const logger = require("../src/global/logger");

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

async function processLineByLine() {
  const uri = "mongodb://localhost:27017/cheersly";

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const ThisOrThatQuestionsCollection = await client
      .db("cheersly")
      .collection("ThisOrThatQuestions");

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

      await ThisOrThatQuestionsCollection.insertOne(payload);
    }
  } catch (error) {
    logger.error(error);
  } finally {
    await client.close();
  }
}

processLineByLine();
