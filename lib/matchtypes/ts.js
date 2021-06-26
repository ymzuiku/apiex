const matchTypes = {
  Null: () => {
    return "any";
  },
  other: (array, val) => {
    if (array) {
      return `${val}[]`;
    }
    return val;
  },
  Int: (array) => {
    if (array) {
      return "number[]";
    }
    return "number";
  },
  Float: (array) => {
    if (array) {
      return "number[]";
    }
    return "number";
  },
  String: (array, non) => {
    if (array) {
      return "String[]";
    }
    return "String";
  },
  Bool: (array) => {
    if (array) {
      return "Boolean[]";
    }
    return "Boolean";
  },
};

module.exports = matchTypes;
