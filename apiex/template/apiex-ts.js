const buildCombine = ({ structs, handles }) => `
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: sessionStorage.getItem("Authorization"),
});
const onError = (error: any) => {
  console.error(error);
};
${structs}
${handles}
`;

const buildType = ({ name, fields }) => {
  const items = fields.map((item) => {
    return `${item.name}${item.notNull ? "" : "?"}: ${item.type};`;
  });
  return `
export interface ${name} {
  ${items.join("\n  ")}
}
  `;
};

const buildInterface = ({ name, fields }) => {
  const items = fields.map((item) => {
    return `
  ${item.name}: (input: ${item.input}):Promise<${item.type.name}> =>{
    return fetch("${item.opts.url}", {
      method: "${item.opts.method}",
      headers: headers(),
      body:JSON.stringify(input)
    }).then(v=>v.json()).then(v=>v.data).catch(onError) as any;
  },`;
  });

  return `
export const ${name} = {
  ${items.join("\n  ")}
}
`;
};

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

module.exports = {
  matchTypes,
  buildType,
  buildInterface,
  buildCombine,
};
