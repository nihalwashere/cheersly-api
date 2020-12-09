const createAPITokensRevokedTemplate = (teamId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "API tokens revoked by team - " + teamId
      }
    }
  ];
};

const createAppUninstalledTemplate = (teamId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Slack app uninstalled by team - " + teamId
      }
    }
  ];
};

const createAppInstalledTemplate = (teamId) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "App installed by team - " + teamId
      }
    }
  ];
};

module.exports = {
  createAPITokensRevokedTemplate,
  createAppUninstalledTemplate,
  createAppInstalledTemplate
};
