// const mongoose = require("mongoose");
// const { MONGO_URL, MONGO_OPTIONS } = require("../src/global/config");
const AuthModel = require("../src/mongo/models/Auth");
const RewardsModel = require("../src/mongo/models/Rewards");
const CompanyValuesModel = require("../src/mongo/models/CompanyValues");
const {
  addDefaultCompanyValuesForTeam,
} = require("../src/mongo/helper/companyValues");
const { addDefaultRewardsForTeam } = require("../src/mongo/helper/rewards");
const logger = require("../src/global/logger");

async function service() {
  //   const url = "mongodb://localhost:27017/cheersly";

  //   mongoose
  //     .connect(MONGO_URL, MONGO_OPTIONS)
  //     .then(() => logger.info("MongoDB Connected!!!"))
  //     .catch(err => logger.error("MongoDB Connection Failed -> error ", err));

  try {
    const auths = await AuthModel.find({});

    logger.debug("auths : ", auths.length);

    auths.forEach(async auth => {
      const {
        slackInstallation: {
          team: { id: teamId },
        },
      } = auth;

      logger.debug("Started for team : ", teamId);

      const companyValues = await CompanyValuesModel.find({ teamId });
      logger.debug("companyValues : ", companyValues.length);

      if (!companyValues.length) {
        logger.debug("Creating default company values for team : ", teamId);
        await addDefaultCompanyValuesForTeam(teamId);
      }

      const rewards = await RewardsModel.find({ teamId });
      logger.debug("rewards : ", rewards.length);

      if (!rewards.length) {
        logger.debug("Creating default rewards for team : ", teamId);
        await addDefaultRewardsForTeam(teamId);
      }
    });
  } catch (error) {
    logger.error(error);
  }

  //   finally {
  //     mongoose.disconnect();
  //   }
}

service();
