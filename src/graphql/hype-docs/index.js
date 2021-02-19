const {
  CreateHypeDocType,
  HypeDocsListType,
  UpdateHypeDocType,
  DeleteHypeDocType,
  HypeDocDetailsType
} = require("./types");
const {
  CreateHypeDocArgs,
  HypeDocsListArgs,
  UpdateHypeDocArgs,
  DeleteHypeDocArgs,
  HypeDocDetailsArgs
} = require("./args");
const {
  CreateHypeDocResolver,
  HypeDocsListResolver,
  UpdateHypeDocResolver,
  DeleteHypeDocResolver,
  HypeDocDetailsResolver
} = require("./resolvers");

const CreateHypeDocMutation = {
  type: CreateHypeDocType,
  args: CreateHypeDocArgs,
  resolve: CreateHypeDocResolver
};

const HypeDocsList = {
  type: HypeDocsListType,
  args: HypeDocsListArgs,
  resolve: HypeDocsListResolver
};

const UpdateHypeDocMutation = {
  type: UpdateHypeDocType,
  args: UpdateHypeDocArgs,
  resolve: UpdateHypeDocResolver
};

const DeleteHypeDocMutation = {
  type: DeleteHypeDocType,
  args: DeleteHypeDocArgs,
  resolve: DeleteHypeDocResolver
};

const HypeDocDetails = {
  type: HypeDocDetailsType,
  args: HypeDocDetailsArgs,
  resolve: HypeDocDetailsResolver
};

module.exports = {
  // queries
  HypeDocsList,
  HypeDocDetails,

  // mutations
  CreateHypeDocMutation,
  UpdateHypeDocMutation,
  DeleteHypeDocMutation
};
