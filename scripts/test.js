/* eslint-disable */

const moment = require("moment-timezone");

const { nanoid } = require("nanoid");

// const text =
//   "@user1 @user2 @user3      Thanks for all the help \n      dasdsad dasdsada \n dasdsa :beers:";

// const split = text.split("@");

// console.log("split : ", split);

// const n = split.length - 1;
// console.log("n : ", n);

// const users = [];
// let description = "";

// for (let i = 1; i <= n; i++) {
//   if (i === n) {
//     console.log("i : ", i);
//     console.log("here : ", split[i]);
//     const user = split[i].split(" ")[0].trim();
//     users.push(user);

//     description = split[i].substring(split[i].indexOf(" ") + 1).trim();
//   } else {
//     users.push(String(split[i]).trim());
//   }
// }

// console.log("users : ", users);
// console.log("description : ", description);

// if (String("").trim().length) {
//   console.log("str : ", String("").trim());
// }

// const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // your array, filled with values
// const n = 3; // tweak this to add more items per line

// const result = new Array(Math.ceil(items.length / n))
//   .fill()
//   .map((_) => items.splice(0, n));

// console.log("result : ", result);

// const str = "abc----def";

// console.log("result : ", str.split("----"));

const now = new Date();
// console.log("now : ", now);

// console.log("later : ", moment().add(60, "minutes").toDate());

// console.log("from : ", moment().subtract(7, "day").startOf("day").toDate());
// console.log("to : ", moment().format("Do MMM YYYY"));

// console.log("to : ", moment().startOf("day").toDate());

// function paginate(array, page_size, page_number) {
//   // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
//   return array.slice((page_number - 1) * page_size, page_number * page_size);
// }

// console.log(paginate([1, 2, 3, 4, 5, 6], 3, 2));

// console.log(
//   "from : ",
//   moment().subtract(1, "months").startOf("month").toDate(),
//   "to : ",
//   moment().subtract(1, "months").endOf("month").toDate()
// );

// console.log("due date : ", new Date("2021-04-28 12:40:50.813Z").getDate());

// console.log("date : ", moment(new Date()).format("LL"));

// const date = "2021-05-15T11:54:12.700Z";

// console.log(new Date(date).getDate());

// console.log("days : ", new Date().getDate() - new Date(date).getDate());

// console.log(nanoid(10));

const blocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "<@U018RT0Q4F7> has challenged you to play a round of *Tic Tac Toe*",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: ":x:'s turn",
    },
  },
  {
    type: "actions",
    block_id: "TIC_TAC_TOE_ROW_1",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_1",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_2",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_3",
      },
    ],
  },
  {
    type: "actions",
    block_id: "TIC_TAC_TOE_ROW_2",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_1",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_2",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_3",
      },
    ],
  },
  {
    type: "actions",
    block_id: "TIC_TAC_TOE_ROW_3",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_1",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_2",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: ":question:",
          emoji: true,
        },
        value: "8cSc-lO48B",
        action_id: "TIC_TAC_TOE_COLUMN_3",
      },
    ],
  },
];

const row = 1;
const column = 1;

blocks.splice(1, 0, {
  type: "section",
  text: {
    type: "mrkdwn",
    text: `<@> has made their move. Waiting for the opponent to play.`,
  },
});

blocks.splice(2, 1, {
  type: "section",
  text: {
    type: "mrkdwn",
    text: ":o:'s turn",
  },
});

if (row === 1) {
  // first row

  blocks.splice(3, 1, {
    ...blocks[3],
    elements: blocks[3].elements.splice(column - 1, 1, {
      ...blocks[3].elements[column - 1],
      text: {
        ...blocks[3].elements[column - 1].text,
        text: ":x:",
      },
    }),
  });
}

if (row === 2) {
  // second row

  blocks.splice(4, 1, {
    ...blocks[4],
    elements: blocks[4].elements.splice(column - 1, 1, {
      ...blocks[4].elements[column - 1],
      text: {
        ...blocks[4].elements[column - 1].text,
        text: ":x:",
      },
    }),
  });
}

if (row === 3) {
  // third row

  blocks.splice(5, 1, {
    ...blocks[5],
    elements: blocks[5].elements.splice(column - 1, 1, {
      ...blocks[5].elements[column - 1],
      text: {
        ...blocks[5].elements[column - 1].text,
        text: ":x:",
      },
    }),
  });
}

console.log("blocks final : ", JSON.stringify(blocks, 1));
