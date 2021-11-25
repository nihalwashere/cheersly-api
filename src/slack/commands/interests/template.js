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

const getTopicActions = (topics) =>
  topics.map((topic) => ({
    type: "button",
    text: {
      type: "plain_text",
      text: topic,
      emoji: true
    },
    value: topic,
    action_id: topic
  }));

const createInterestsTemplate = (callback_id, topics, interests) => {
  let noTopicsAvailable = false;
  let noInterestsAvailable = false;
  let allTopicsSelected = false;

  if (!topics.length) {
    noTopicsAvailable = true;
  }

  if (!interests.length) {
    noInterestsAvailable = true;
  }

  if (
    topics.length > 0 &&
    interests.length > 0 &&
    topics.length === interests.length
  ) {
    allTopicsSelected = true;
  }

  const blocks = [
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
    }
  ];

  if (noTopicsAvailable) {
    blocks.push(noTopicsAvailableBlock());
  } else {
    blocks.push({
      type: "actions",
      elements: getTopicActions(topics)
    });
  }

  if (allTopicsSelected) {
    blocks.push(allTopicsSelectedBlock());
  }

  blocks.push({
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
  });

  blocks.push({
    type: "divider"
  });

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Current Interests*"
    }
  });

  if (noInterestsAvailable) {
    blocks.push(noCurrentInterestsAvailable());
  } else {
    blocks.push({
      type: "actions",
      elements: getTopicActions(interests)
    });
  }

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
    blocks
  };
};

module.exports = { createInterestsTemplate };
