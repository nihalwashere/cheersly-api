const { CheersStatType } = require("./types");
const { CheersStatArgs } = require("./args");
const { CheersStatResolver } = require("./resolvers");

const CheersStat = {
  type: CheersStatType,
  args: CheersStatArgs,
  resolve: CheersStatResolver
};

module.exports = { CheersStat };
