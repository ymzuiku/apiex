const matchTypes = {
  empty: () => {
    return "any";
  },
  other: (array, non, val) => {
    if (array && non) {
      return `${val}[]`;
    }
    if (array) {
      return `${val}[]`;
    }
    return val;
  },
  Int: (array, non) => {
    if (array && non) {
      return "number[]";
    }
    if (array) {
      return "number[]";
    }
    return "number";
  },
  Float: (array, non) => {
    if (array && non) {
      return "number[]";
    }
    if (array) {
      return "number[]";
    }
    return "number";
  },
  String: (array, non) => {
    if (array && non) {
      return "String[]";
    }
    if (array) {
      return "String[]";
    }
    return "String";
  },
  Bool: (array, non) => {
    if (array && non) {
      return "Boolean[]";
    }
    if (array) {
      return "Boolean[]";
    }
    return "Boolean";
  },
};

module.exports = matchTypes;
