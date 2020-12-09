const express = require("express");

const router = express.Router();

const logger = require("../../global/logger");
const { getSlackTokenForUser } = require("../../slack/api");
const { paginateUsersList } = require("../../slack/pagination/users-list");
const { addAuth } = require("../../mongo/helper/auth");
const { getUsersForTeam } = require("../../mongo/helper/user");
const { sendOnBoardingInstructions } = require("../../slack/onboarding");
const { waitForMilliSeconds } = require("../../utils/common");

router.post("/slack-install", async (req, res) => {
  try {
    const { code } = req.body;

    logger.debug("code : ", code);

    if (code) {
      const slackTokenPayload = await getSlackTokenForUser(code);
      logger.debug("slackTokenPayload : ", slackTokenPayload);

      if (slackTokenPayload && slackTokenPayload.ok === true) {
        await addAuth({ slackInstallation: slackTokenPayload });

        const { access_token } = slackTokenPayload;

        const fetchedAllMembers = await paginateUsersList(access_token);

        if (fetchedAllMembers) {
          const {
            team: { id: teamId }
          } = slackTokenPayload;

          const users = await getUsersForTeam(teamId);

          await Promise.all(
            users.map(async (user) => {
              const {
                slackUserData: { id: channelId }
              } = user;
              await sendOnBoardingInstructions(channelId, teamId);
              await waitForMilliSeconds(1000);
            })
          );
        }
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    logger.error("/slack-install -> error : ", error);
  }
});

module.exports = router;
