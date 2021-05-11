const CompanyValues = require("../models/CompanyValues");
const CommanCompanyValues = require("../../utils/commonCompanyValues");
const logger = require("../../global/logger");

const getCompanyValuesByTeamId = async (teamId) => {
  try {
    return await CompanyValues.find({ teamId });
  } catch (error) {
    logger.error(`getCompanyValuesByTeamId() -> error : `, error);
  }
};

const addCompanyValues = async (payload) => {
  try {
    return await new CompanyValues(payload).save();
  } catch (error) {
    logger.error(`addCompanyValues() -> error : `, error);
  }
};

const addCommonCompanyValuesForTeam = async (teamId) => {
  try {
    return await CompanyValues.insertMany(
      CommanCompanyValues.map((value) => ({ ...value, teamId }))
    );
  } catch (error) {
    logger.error(`addCommonCompanyValuesForTeam() -> error : `, error);
  }
};

const updateCompanyValuesById = async (_id, title, description) => {
  try {
    return await CompanyValues.updateOne(
      { _id },
      {
        $set: {
          title,
          description
        }
      }
    );
  } catch (error) {
    logger.error(`updateCompanyValuesById() -> error : `, error);
  }
};

const deleteCompanyValuesById = async (_id) => {
  try {
    return await CompanyValues.deleteOne({ _id });
  } catch (error) {
    logger.error(`deleteCompanyValuesById() -> error : `, error);
  }
};

module.exports = {
  getCompanyValuesByTeamId,
  addCompanyValues,
  addCommonCompanyValuesForTeam,
  updateCompanyValuesById,
  deleteCompanyValuesById
};
