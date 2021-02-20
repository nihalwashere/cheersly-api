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
console.log("now : ", now);

// console.log("later : ", moment().add(60, "minutes").toDate());

console.log("from : ", moment().subtract(7, "day").startOf("day").toDate());
console.log("to : ", moment().format("Do MMM YYYY"));

console.log("to : ", moment().startOf("day").toDate());
