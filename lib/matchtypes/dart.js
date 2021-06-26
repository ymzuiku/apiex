const matchTypes = {
  Null: () => {
    return "dynamic?";
  },
  other: (array, non, val) => {
    if (array && non) {
      return `List<${val}>`;
    }
    if (array) {
      return `List<${val}>?`;
    }
    if (non) {
      return val;
    }
    return `${val}?`;
  },
  Int: (array, non) => {
    if (array && non) {
      return "List<int>";
    }
    if (array) {
      return "List<int>?";
    }
    if (non) {
      return "int";
    }
    return "int?";
  },
  Float: (array, non) => {
    if (array && non) {
      return "List<Float>";
    }
    if (array) {
      return "List<Float>?";
    }
    if (non) {
      return "Float";
    }
    return "Float?";
  },
  String: (array, non) => {
    if (array && non) {
      return "List<String>";
    }
    if (array) {
      return "List<String>?";
    }
    if (non) {
      return "String";
    }
    return "String?";
  },
  Bool: (array, non) => {
    if (array && non) {
      return "List<bool>";
    }
    if (array) {
      return "List<bool>?";
    }
    if (non) {
      return "bool";
    }
    return "bool?";
  },
};

module.exports = matchTypes;
