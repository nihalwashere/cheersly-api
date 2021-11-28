const isHelpCommand = text => {
  if (
    String(text)
      .trim()
      .includes("he")
  ) {
    return true;
  }

  return false;
};

module.exports = { isHelpCommand };
