const { getCompanyValuesByTeamId } = require("../mongo/helper/companyValues");

const wrapCompanyValueOptionsForTeam = async teamId => {
  const companyValues = await getCompanyValuesByTeamId(teamId);

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
