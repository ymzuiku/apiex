const firstUpperCase = ([first, ...rest]) =>
  first.toUpperCase() + rest.join("");

const capUpperCase = ([first, ...rest]) =>
  first.toUpperCase() + rest.map((v) => v.toLowerCase()).join("");

module.exports = {
  firstUpperCase,
  capUpperCase,
};
