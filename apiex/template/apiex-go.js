const buildCombine = ({ types, interfaces, schema }) => `
package apiex

import "github.com/gofiber/fiber/v2"

var Fiber = fiber.New()

func SchemaInit() {
	Fiber.Get("/apiex", func(c *fiber.Ctx) error {
		return c.SendString(schemaText)
	})
}
${types}
${interfaces}
const schemaText = \`${schema}\``;

const buildType = ({ name, fields }) => {
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
}`;
};

const buildInterface = ({ upperName, fields }) => {
  const items = fields.map((item) => {
    if (item.input) {
      return `${item.upperName}(input *${item.input}) (${item.type}, error)`;
    }
    return `${item.upperName}() (${item.type}, error)`;
  });

  const itemsInterface = fields.map((item) => {
    if (item.input) {
      return `
  Fiber.${item.opts.method1}("${item.opts.url}", func(c *fiber.Ctx) error {
    var body ${item.input}
    err := c.QueryParser(&body)
    if err != nil {
      return err
    }
    out, err := handles.${item.upperName}(&body)

    if err != nil {
      return err
    }

    return c.JSON(out)
  })`;
    } else {
      return `
  Fiber.${item.opts.method1}("${item.opts.url}", func(c *fiber.Ctx) error {
    out, err := handles.${item.upperName}()

    if err != nil {
      return err
    }

    return c.JSON(out)
  })`;
    }
  });

  return `  
type ${upperName} interface {
  ${items.join("\n  ")}
}

func ${upperName}Init(handles ${upperName}) {
	Fiber.Get("/apiex", func(c *fiber.Ctx) error {
		return c.SendString(schemaText)
	})
  ${itemsInterface.join("\n  ")}
}
`;
};

module.exports = {
  type: "go",
  buildType,
  buildInterface,
  buildCombine,
};
