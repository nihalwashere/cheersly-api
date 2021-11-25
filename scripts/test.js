const moment = require("moment-timezone");

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

const topics = [
  {
    id: "Tzbnzan_9P",
    value: "Tech"
  },
  {
    id: "jmkhzWOb0O",
    value: "Cars"
  },
  {
    id: "V6jDx9DFAD",
    value: "Bikes"
  },
  {
    id: "LUIpMPVjgb",
    value: "Crypto"
  }
];

const interests = [
  {
    id: "jmkhzWOb0O",
    value: "Cars"
  },
  {
    id: "LUIpMPVjgb",
    value: "Crypto"
  }
];

const unSelectedTopics = [];

// interests.forEach((elem) => {
//   console.log("elem : ", elem);
//   console.log("topicIds.includes(elem.id : ", topicIds.includes(elem.id));
//   if (!topicIds.includes(elem.id)) {
//     unSelectedTopics.push(elem);
//   }
// });

topics.forEach((elem) => {
  if (!interests.some((item) => item.id === elem.id)) {
    unSelectedTopics.push(elem);
  }
});

console.log("topics : ", topics);
console.log("interests : ", interests);
console.log("unSelectedTopics : ", unSelectedTopics);
