const express = require("express");

const router = express.Router();

const UserModel = require("../../mongo/models/User");
const {
  INTERNAL_SLACK_TEAM_ID,
  INTERNAL_SLACK_CHANNEL_ID,
} = require("../../global/config");
const { createAppInstalledTemplate } = require("../../slack/templates");
const {
  getSlackTokenForUser,
  postInternalMessage,
} = require("../../slack/api");
const { paginateUsersList } = require("../../slack/pagination/users-list");
const {
  upsertAuth,
  getAuthDeletedOrNotDeleted,
} = require("../../mongo/helper/auth");
const {
  addDefaultCompanyValuesForTeam,
} = require("../../mongo/helper/companyValues");
const { addDefaultRewardsForTeam } = require("../../mongo/helper/rewards");
const { sendOnBoardingInstructions } = require("../../slack/onboarding");
const {
  createTrialSubscription,
  validateToken,
} = require("../../utils/common");
const { encodeJWT } = require("../../utils/jwt");
const logger = require("../../global/logger");

router.post("/signup", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Invaid params." });
    }

    const slackTokenPayload = await getSlackTokenForUser({
      code,
      isSignUp: true,
    });

    if (!slackTokenPayload || !slackTokenPayload.ok) {
      return res.status(400).json({ success: false, message: "Invaid auth." });
    }

    const {
      team: { id: teamId },
      access_token,
      authed_user: { id: authedUserId },
    } = slackTokenPayload;

    // check if installation already exists
    const auth = await getAuthDeletedOrNotDeleted(teamId);

    if (!auth) {
      // if installation does not exist already, then create trial subscription
      await createTrialSubscription(teamId);
      await addDefaultCompanyValuesForTeam(teamId);
      await addDefaultRewardsForTeam(teamId);
    }

    await upsertAuth(teamId, {
      slackInstallation: slackTokenPayload,
      slackDeleted: false,
    });

    await paginateUsersList(access_token);

    if (!auth) {
      await sendOnBoardingInstructions(teamId, authedUserId);
    }

    await postInternalMessage(
      INTERNAL_SLACK_TEAM_ID,
      INTERNAL_SLACK_CHANNEL_ID,
      createAppInstalledTemplate(teamId)
    );

    const authedUser = await UserModel.findOne({
      "slackUserData.id": authedUserId,
    });

    if (!authedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    return res
      .header("x-access-token", encodeJWT({ teamId, userId: authedUserId }))
      .status(200)
      .json({
        success: true,
        message: "Installation was successfull.",
        data: {
          user: {
            role: authedUser.role,
            country: authedUser.country,
            slackUserData: authedUser.slackUserData,
          },
        },
      });
  } catch (error) {
    logger.error("/signup -> error : ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Invaid params." });
    }

    const slackTokenPayload = await getSlackTokenForUser({
      code,
    });

    if (!slackTokenPayload || !slackTokenPayload.ok) {
      return res.status(400).json({ success: false, message: "Invaid auth." });
    }

    const {
      team: { id: teamId },
      authed_user: { id: authedUserId },
    } = slackTokenPayload;

    const authedUser = await UserModel.findOne({
      "slackUserData.id": authedUserId,
    });

    if (!authedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    return res
      .header("x-access-token", encodeJWT({ teamId, userId: authedUserId }))
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully.",
        data: {
          user: {
            role: authedUser.role,
            country: authedUser.country,
            slackUserData: authedUser.slackUserData,
          },
        },
      });
  } catch (error) {
    logger.error("/login failed -> ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

router.post("/validate", async (req, res) => {
  try {
    const payload = await validateToken(req.headers);

    if (!payload.success) {
      return res.status(401).json(payload);
    }

    return res.status(200).json(payload);
  } catch (error) {
    logger.error("/validate failed -> ", error);
    return res.status(500).json({
      success: false,
      message: "Oops! Something went wrong!",
    });
  }
});

module.exports = router;
