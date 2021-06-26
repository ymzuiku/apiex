const matchTypes = {
  other: (array, non, val) => {
    if (array && non) {
      return `List<${val}>?`;
    }
    if (array) {
      return `List<${val}>?`;
    }
    return val;
  },
  Int: (array, non) => {
    if (array && non) {
      return "List<int>?";
    }
    if (array) {
      return "List<int>?";
    }
    return "int?";
  },
  Float: (array, non) => {
    if (array && non) {
      return "List<Float>?";
    }
    if (array) {
      return "List<Float>?";
    }
    return "Float?";
  },
  String: (array, non) => {
    if (array && non) {
      return "List<String>?";
    }
    if (array) {
      return "List<String>?";
    }
    return "List<String>?";
  },
  Bool: (array, non) => {
    if (array && non) {
      return "List<bool>?";
    }
    if (array) {
      return "List<bool>?";
    }
    return "bool?";
  },
};

module.exports = matchTypes;
