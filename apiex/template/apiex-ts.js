const buildCombine = ({ types, interfaces }) => `
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: sessionStorage.getItem("Authorization"),
});
const onError = (error: any) => {
  console.error(error);
};
${types}
${interfaces}
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

module.exports = {
  type: "ts",
  buildType,
  buildInterface,
  buildCombine,
};
