const {
  CompanyValuesListType,
  CreateCompanyValuesType,
  UpdateCompanyValuesType,
  DeleteCompanyValuesType
} = require("./types");
const {
  CompanyValuesListArgs,
  CreateCompanyValuesArgs,
  UpdateCompanyValuesArgs,
  DeleteCompanyValuesArgs
} = require("./args");
const {
  CompanyValuesListResolver,
  CreateCompanyValuesResolver,
  UpdateCompanyValuesResolver,
  DeleteCompanyValuesResolver
} = require("./resolvers");

const CompanyValuesList = {
  type: CompanyValuesListType,
  args: CompanyValuesListArgs,
  resolve: CompanyValuesListResolver
};

const CreateCompanyValues = {
  type: CreateCompanyValuesType,
  args: CreateCompanyValuesArgs,
  resolve: CreateCompanyValuesResolver
};

const UpdateCompanyValues = {
  type: UpdateCompanyValuesType,
  args: UpdateCompanyValuesArgs,
  resolve: UpdateCompanyValuesResolver
};

const DeleteCompanyValues = {
  type: DeleteCompanyValuesType,
  args: DeleteCompanyValuesArgs,
  resolve: DeleteCompanyValuesResolver
};

module.exports = {
  CompanyValuesList,
  CreateCompanyValues,
  UpdateCompanyValues,
  DeleteCompanyValues
};
