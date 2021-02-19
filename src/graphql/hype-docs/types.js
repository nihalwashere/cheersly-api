const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const CreateHypeDocType = new GraphQLObjectType({
  name: "CreateHypeDocType",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const HypeDocType = new GraphQLObjectType({
  name: "HypeDocType",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    category: { type: GraphQLString },
    when: { type: GraphQLDateTime },
    content: { type: GraphQLString }
  })
});

const HypeDocsListType = new GraphQLObjectType({
  name: "HypeDocsListType",
  fields: () => ({
    data: { type: new GraphQLList(HypeDocType) },
    totalCount: { type: GraphQLInt },
    totalPages: { type: GraphQLFloat }
  })
});

const UpdateHypeDocType = new GraphQLObjectType({
  name: "UpdateHypeDocType",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const DeleteHypeDocType = new GraphQLObjectType({
  name: "DeleteHypeDocType",
  fields: () => ({
    success: { type: GraphQLBoolean }
  })
});

const HypeDocDetailsType = new GraphQLObjectType({
  name: "HypeDocDetailsType",
  fields: () => ({
    data: { type: HypeDocType }
  })
});

module.exports = {
  CreateHypeDocType,
  HypeDocsListType,
  UpdateHypeDocType,
  DeleteHypeDocType,
  HypeDocDetailsType
};
