const isHelpCommand = (text) => {
  if (String(text).trim().includes("help")) {
    return true;
  }

  return false;
};

module.exports = { isHelpCommand };
