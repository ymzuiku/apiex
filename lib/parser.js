const fs = require("fs");

const { parse } = require("graphql");
const { firstUpperCase } = require("./utils");

const changeDot = (str = "") => {
  return str.replace(/\'/g, '"');
};

const parseType = (item, matchTypes) => {
  const pars = matchTypes[item.type];
  const other = matchTypes.other;
  if (pars) {
    return pars(item.list, item.notNull);
  }
  if (item.type && other) {
    return other(item.list, item.notNull, item.type);
  }
  return false;
};

const mapDot = (str = "") => {
  if (/^(POST|GET|PUT|DELETE|OPTIONS)/.test(str)) {
    const [method, url] = str.split(" ");
    return {
      method,
      url,
    };
  }
  const list = str.split(" ").filter(Boolean);
  const out = {};
  list.forEach((item) => {
    let [key, value] = item.split(":");
    if (value) {
      if (/(\"|\')/.test(value)) {
        value = value.replace(/(\"|\')/g, "");
      } else {
        value = Number(value);
      }

      out[key] = value;
    }
  });
  return out;
};

const parser = (schemaCode = "", matchTypes) => {
  const schemas = parse(schemaCode, { noLocation: true }).definitions;
  if (!schemas) {
    throw "schema code parser error";
  }
  const out = schemas.map((item) => {
    const out = {};
    if (item.kind === "ObjectTypeDefinition") {
      out.kind = "type";
    } else if (item.kind === "InterfaceTypeDefinition") {
      out.kind = "interface";
    }
    if (item.description && item.description.kind === "StringValue") {
      out.desc = changeDot(item.description.value);
      out.opts = mapDot(item.description.value);
      if (out.opts && out.opts.method && out.opts.url) {
        out.isHandle = true;
      }
      if (item.description.block) {
        out.block = true;
      }
    }
    delete item.interfaces;
    delete item.directives;
    if (item.name && item.name.kind == "Name") {
      out.name = item.name.value;
      out.upperName = firstUpperCase(out.name);
    }
    if (item.fields) {
      out.fields = item.fields.map((field) => {
        let name = (field.name && field.name.value) || "";
        const sub = {
          name,
          upperName: firstUpperCase(name),
        };
        if (field.description && field.description.kind === "StringValue") {
          sub.desc = changeDot(field.description.value);
          sub.opts = mapDot(field.description.value);
          if (field.description.block) {
            sub.block = true;
          }
          if (sub.opts && sub.opts.method && sub.opts.url) {
            sub.isHandle = true;
          }
        }

        const loadTypeName = (obj, opt) => {
          if (obj.kind === "InputValueDefinition") {
            return loadTypeName(obj.type, opt);
          }
          if (obj.kind === "NonNullType") {
            opt.notNull = true;
            return loadTypeName(obj.type, opt);
          }
          if (obj.kind === "ListType") {
            opt.list = true;
            return loadTypeName(obj.type, opt);
          }
          if (obj.kind === "NamedType") {
            opt.type = obj.name.value;
            return opt;
          }
        };

        Object.assign(sub, loadTypeName(field.type, {}));

        if (field.arguments) {
          const arg = field.arguments[0];
          if (arg) {
            sub.input = parseType(loadTypeName(arg, {}), matchTypes);
          } else {
            sub.input = parseType({}, matchTypes);
          }
        }

        return sub;
      });
    }
    return out;
  });
  const data = {};
  out.forEach((item, index) => {
    item.index = index;
    data[item.name] = item;
  });
  out.forEach((sub) => {
    if (!sub.fields) {
      return;
    }
    sub.fields.forEach((item) => {
      if (item.type) {
        item.type = parseType(item, matchTypes);
      }
      item.parent = sub.name;
      item.upperParent = sub.upperName;
      if (item.isHandle && item.type && data[item.type]) {
        // item.typeIndex = data[item.type].index;
        item.type = data[item.type];
      }
    });
  });
  fs.writeFileSync("temp.json", JSON.stringify(out, null, 2));
  fs.writeFileSync("temp_all.json", JSON.stringify(schemas, null, 2));
  return out;
};

module.exports = parser;
