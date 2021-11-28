const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const CompanyValueType = new GraphQLObjectType({
  name: "CompanyValueType",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const CompanyValuesListType = new GraphQLObjectType({
  name: "CompanyValuesListType",
  fields: () => ({
    data: { type: new GraphQLList(CompanyValueType) },
  }),
});

const CreateCompanyValuesType = new GraphQLObjectType({
  name: "CreateCompanyValuesType",
  fields: () => ({
    success: { type: GraphQLBoolean },
  }),
});

const UpdateCompanyValuesType = new GraphQLObjectType({
  name: "UpdateCompanyValuesType",
  fields: () => ({
    success: { type: GraphQLBoolean },
  }),
});

const DeleteCompanyValuesType = new GraphQLObjectType({
  name: "DeleteCompanyValuesType",
  fields: () => ({
    success: { type: GraphQLBoolean },
  }),
});

module.exports = {
  CompanyValuesListType,
  CreateCompanyValuesType,
  UpdateCompanyValuesType,
  DeleteCompanyValuesType,
};
