const {
  getCompanyValuesByTeamId,
  addCompanyValues,
  updateCompanyValuesById,
  deleteCompanyValuesById
} = require("../../mongo/helper/companyValues");
const { validateToken } = require("../../utils/common");

const CompanyValuesListResolver = async (_, args, context) => {
  try {
    const { slackTeamId: teamId } = await validateToken(context.headers);

    const data = await getCompanyValuesByTeamId(teamId);

    return {
      data
    };
  } catch (error) {
    throw new Error(error);
  }
};

const CreateCompanyValuesResolver = async (_, args, context) => {
  try {
    const { slackTeamId: teamId } = await validateToken(context.headers);

    const { title, description } = args;

    if (!title) {
      throw new Error("Title is required.");
    }

    if (!description) {
      throw new Error("Description is required.");
    }

    await addCompanyValues({ title, description, teamId });

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

const UpdateCompanyValuesResolver = async (_, args, context) => {
  try {
    await validateToken(context.headers);

    const { id, title, description } = args;

    if (!id) {
      throw new Error("Id is required.");
    }

    if (!title) {
      throw new Error("Title is required.");
    }

    if (!description) {
      throw new Error("Description is required.");
    }

    await updateCompanyValuesById(id, title, description);

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

const DeleteCompanyValuesResolver = async (_, args, context) => {
  try {
    await validateToken(context.headers);

    const { id } = args;

    if (!id) {
      throw new Error("Id is required.");
    }

    await deleteCompanyValuesById(id);

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  CompanyValuesListResolver,
  CreateCompanyValuesResolver,
  UpdateCompanyValuesResolver,
  DeleteCompanyValuesResolver
};
