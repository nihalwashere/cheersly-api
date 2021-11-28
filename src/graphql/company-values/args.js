const { GraphQLString } = require("graphql");

const CompanyValuesListArgs = {};

const CreateCompanyValuesArgs = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
};

const UpdateCompanyValuesArgs = {
  id: { type: GraphQLString },
  title: { type: GraphQLString },
  description: { type: GraphQLString },
};

const DeleteCompanyValuesArgs = {
  id: { type: GraphQLString },
};

module.exports = {
  CompanyValuesListArgs,
  CreateCompanyValuesArgs,
  UpdateCompanyValuesArgs,
  DeleteCompanyValuesArgs,
};
