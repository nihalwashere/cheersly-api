const {
  SLACK_ACTIONS: { ADD_NEW_TOPIC }
} = require("../../../global/constants");

const noTopicsAvailableBlock = () => ({
  type: "context",
  elements: [
    {
      type: "plain_text",
      text: "There are no topics yet, start with adding a new topic first.",
      emoji: true
    }
  ]
});

const noCurrentInterestsAvailable = () => ({
  type: "context",
  elements: [
    {
      type: "plain_text",
      text: "You don't have any interests yet.",
      emoji: true
    }
  ]
});

const allTopicsSelectedBlock = () => ({
  type: "context",
  elements: [
    {
      type: "plain_text",
      text: "You are interested in all topics already.",
      emoji: true
    }
  ]
});

const getTopicActions = (interests) =>
  interests.map((elem) => ({
    type: "button",
    text: {
      type: "plain_text",
      text: `${elem}`,
      emoji: true
    },
    value: `${elem}`,
    action_id: "actionId-1"
  }));

const createInterestsTemplate = (callback_id) => {
  return {
    type: "modal",
    callback_id,
    title: {
      type: "plain_text",
      text: "Explore Interests",
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Done",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Explore and click on the topics that you find interesting or add a new topic yourself!"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Explore topics*"
        }
      },
      //   {
      //     type: "actions",
      //     elements: getTopicActions()
      //   },
      noTopicsAvailableBlock(),
      allTopicsSelectedBlock(),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Add new topic",
              emoji: true
            },
            value: "Add new topic",
            action_id: ADD_NEW_TOPIC
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Current Interests*"
        }
      },
      noCurrentInterestsAvailable()
      //   {
      //     type: "actions",
      //     elements: getTopicActions()
      //   }
    ]
  };
};

module.exports = { createInterestsTemplate };
