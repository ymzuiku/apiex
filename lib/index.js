#!/usr/bin/env node

const argv = process.argv.splice(2);
const fs = require("fs-extra");
const path = require("path");
const cwd = process.cwd();
const parser = require("./parser");
const YAML = require("js-yaml");
const { toUpperCase, toHumpCase, toLineCase } = require("./utils");
global.fetch = require("node-fetch");

const yamlFile = argv[0] || "apiex-config.yaml";
// const isFocus = argv.indexOf("-f") > -1;
const isFocus = false;
const lang = argv[1];

if (!argv[0] && !fs.existsSync(path.resolve(cwd, yamlFile))) {
  console.log("Ignore apiex.yaml, please run once:");
  console.error("$ apiex init go");
  console.error("$ apiex init ts");
  console.error("$ apiex init dart");
  return;
}

const tempaltes = {
  dart: 1,
  go: 1,
  ts: 1,
};

const cpFile = (by, to) => {
  if (fs.existsSync(to)) {
    if (isFocus) {
      fs.copyFileSync(by, to);
    }
  } else {
    fs.copyFileSync(by, to);
  }
};

if (yamlFile === "init") {
  if (!tempaltes[lang]) {
    console.error("Ignore template language, Please run once:");
    console.error("$ apiex init go");
    console.error("$ apiex init ts");
    console.error("$ apiex init dart");
    return;
  }

  cpFile(
    path.resolve(__dirname, `../apiex/apiex-${lang}.yaml`),
    path.resolve(cwd, "apiex-config.yaml")
  );

  cpFile(
    path.resolve(__dirname, `../apiex/apiex-schema.gql`),
    path.resolve(cwd, "apiex-schema.gql")
  );

  cpFile(
    path.resolve(__dirname, `../apiex/template/apiex-${lang}.js`),
    path.resolve(cwd, `apiex-${lang}.js`)
  );

  console.log("apiex inited! Please run:");
  console.log(`$ apiex apiex-config.yaml`);
  return;
}

const config = YAML.load(fs.readFileSync(path.resolve(cwd, yamlFile)));

async function Start() {
  let schemaCode = "";
  for (const p of config.graphql) {
    if (/http/.test(p)) {
      if (/\s-o/.test(p)) {
        const [a, b] = p.split(" -o").map((v) => v.trim());
        const code = await fetch(a).then((v) => v.text());
        fs.writeFileSync(path.resolve(cwd, b), code);
        schemaCode += code;
      } else {
        const code = await fetch(p).then((v) => v.text());
        schemaCode += code;
      }
    } else {
      schemaCode += fs.readFileSync(path.resolve(cwd, p), "utf8");
    }
  }

  delete config.graphql;

  Object.keys(config).forEach((key) => {
    const conf = config[key];
    const {
      buildCombine,
      buildInterface,
      buildType,
      type,
    } = require(path.resolve(cwd, conf.builder));

    const schema = parser(schemaCode, type);

    const types = [];
    const interfaces = [];

    schema.forEach((item) => {
      if (item.kind == "interface") {
        if (buildInterface) {
          interfaces.push(
            buildInterface({
              ...item,
              toUpperCase,
              toHumpCase,
              toLineCase,
              data: schema,
            })
          );
        }
      } else {
        if (buildType) {
          types.push(
            buildType({
              ...item,
              toUpperCase,
              toHumpCase,
              toLineCase,
              data: schema,
            })
          );
        }
      }
    });

    let file = buildCombine({
      types: types.join("\n"),
      interfaces: interfaces.join("\n"),
      schema: schemaCode,
      data: schema,
    });

    const outPath = path.resolve(cwd, conf.out);
    const dir = path.parse(outPath).dir;
    if (!fs.existsSync(dir)) {
      fs.mkdirpSync(dir);
    }
    file = `// Code generated by apiex.
// DO NOT EDIT.
// DO NOT EDIT.
// DO NOT EDIT.
// YOU CAN EDIT: <project-root>/${conf.builder}
${file}
    `;
    fs.writeFileSync(outPath, file);
    console.log("Create done:", conf.out);
  });
}

Start();
