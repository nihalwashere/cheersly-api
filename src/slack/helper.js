const CompanyValuesModel = require("../mongo/models/CompanyValues");

const wrapCompanyValueOptionsForTeam = async teamId => {
  const companyValues = await CompanyValuesModel.find({ teamId });

  return companyValues.map(companyValue => {
    const { title } = companyValue;

    const tag = `#${String(title).toLowerCase()}`;

    return {
      text: {
        type: "plain_text",
        text: tag,
        emoji: true,
      },
      value: tag,
    };
  });
};

module.exports = { wrapCompanyValueOptionsForTeam };
