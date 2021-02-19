const { GraphQLNonNull, GraphQLString, GraphQLInt } = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const CreateHypeDocArgs = {
  title: { type: new GraphQLNonNull(GraphQLString) },
  category: { type: new GraphQLNonNull(GraphQLString) },
  when: { type: new GraphQLNonNull(GraphQLDateTime) },
  content: { type: new GraphQLNonNull(GraphQLString) }
};

const HypeDocsListArgs = {
  pageIndex: { type: GraphQLInt },
  pageSize: { type: GraphQLInt }
};

const UpdateHypeDocArgs = {
  id: { type: new GraphQLNonNull(GraphQLString) },
  title: { type: new GraphQLNonNull(GraphQLString) },
  category: { type: new GraphQLNonNull(GraphQLString) },
  when: { type: new GraphQLNonNull(GraphQLDateTime) },
  content: { type: new GraphQLNonNull(GraphQLString) }
};

const DeleteHypeDocArgs = {
  id: { type: new GraphQLNonNull(GraphQLString) }
};

const HypeDocDetailsArgs = {
  id: { type: new GraphQLNonNull(GraphQLString) }
};

module.exports = {
  HypeDocsListArgs,
  CreateHypeDocArgs,
  UpdateHypeDocArgs,
  DeleteHypeDocArgs,
  HypeDocDetailsArgs
};
