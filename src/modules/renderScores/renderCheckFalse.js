function renderCheckFalse(score) {
  return `if(${score}) {
    return { score: null };
  };\n`;
}

module.exports = { renderCheckFalse };
