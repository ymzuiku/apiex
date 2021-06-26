const buildCombine = ({ structs, handles, apis, schema }) => `
package apiex

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)

${structs}

${handles}

var Fiber = fiber.New()

func HandlesInit() {
	Fiber.Get("/apiex", func(c *fiber.Ctx) error {
		return c.SendString(schemaText)
	})

  ${apis}
}

var schemaText = \`
${schema}
\`
`;

const buildStruct = ({ name, fields }) => {
  const items = fields.map((item) => {
    let str = `${item.upperName} ${item.type}`;
    if (item.desc) {
      str += ` \`json:"${item.name}" ${item.desc}\``;
    } else {
      str += ` \`json:"${item.name}"\``;
    }
    return str;
  });
  return `
type ${name} struct {
  ${items.join("\n  ")}
}
  `;
};

const buildHandle = ({ upperName, fields }) => {
  const items = fields.map((item) => {
    return `${item.upperName} func(input *${item.input}) (${item.type.name}, error)`;
  });

  return `
type ${upperName}Methods struct {
  ${items.join("\n  ")}
}
var ${upperName} = ${upperName}Methods{}
`;
};

const buildApi = ({ fields, capUpperCase }) => {
  const items = fields.map((item) => {
    return `
  Fiber.${capUpperCase(item.opts.method)}("${
      item.opts.url
    }", func(c *fiber.Ctx) error {
    var body ${item.input}
    err := c.QueryParser(&body)
    if err != nil {
      return err
    }
    if ${item.upperParent}.${item.upperName} == nil {
      return errors.New("Need define ${item.upperParent}.${item.upperName}")
    }
    out, err := ${item.upperParent}.${item.upperName}(&body)

    if err != nil {
      return err
    }

    return c.JSON(out)
  })`;
  });
  return items.join("\n  ");
};

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

module.exports = {
  matchTypes,
  buildStruct,
  buildHandle,
  buildApi,
  buildCombine,
};
