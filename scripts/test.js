const text =
  "@user1 @user2 @user3      Thanks for all the help \n      dasdsad dasdsada \n dasdsa :beers:";

const split = text.split("@");

console.log("split : ", split);

const n = split.length - 1;
console.log("n : ", n);

const users = [];
let description = "";

for (let i = 1; i <= n; i++) {
  if (i === n) {
    console.log("i : ", i);
    console.log("here : ", split[i]);
    const user = split[i].split(" ")[0].trim();
    users.push(user);

    description = split[i].substring(split[i].indexOf(" ") + 1).trim();
  } else {
    users.push(String(split[i]).trim());
  }
}

console.log("users : ", users);
console.log("description : ", description);
