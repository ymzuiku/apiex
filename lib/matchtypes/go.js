const matchTypes = {
  empty: () => {
    return "map[string]interface{}";
  },
  other: (array, non, val) => {
    if (array && non) {
      return `[]${val}`;
    }
    if (array) {
      return `[]${val}`;
    }
    return val;
  },
  Int: (array, non) => {
    if (array && non) {
      return "[]int";
    }
    if (array) {
      return "[]int";
    }
    return "int";
  },
  Float: (array, non) => {
    if (array && non) {
      return "[]float64";
    }
    if (array) {
      return "[]float64";
    }
    return "float64";
  },
  String: (array, non) => {
    if (array && non) {
      return "[]string";
    }
    if (array) {
      return "[]string";
    }
    return "string";
  },
  Bool: (array, non) => {
    if (array && non) {
      return "[]bool";
    }
    if (array) {
      return "[]bool";
    }
    return "bool";
  },
};

module.exports = matchTypes;
