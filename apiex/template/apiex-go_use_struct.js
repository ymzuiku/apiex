// user struct fn

const buildCombine = ({ types, interfaces, handles, schema }) => `
package apiex

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)
${types}
${interfaces}

var Fiber = fiber.New()

func HandlesInit() {
	Fiber.Get("/apiex", func(c *fiber.Ctx) error {
		return c.SendString(schemaText)
	})
  ${handles}
}

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
      return `${item.upperName} func(input *${item.input}) (${item.type.name}, error)`;
    }
    return `${item.upperName} func() (${item.type.name}, error)`;
  });

  return `
type _${upperName}Methods struct {
  ${items.join("\n  ")}
}

var ${upperName} = _${upperName}Methods{}`;
};

const buildHandle = ({ fields }) => {
  const items = fields.map((item) => {
    if (item.input) {
      return `
  Fiber.${item.opts.method1}("${item.opts.url}", func(c *fiber.Ctx) error {
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
    } else {
      return `
  Fiber.${item.opts.method1}("${item.opts.url}", func(c *fiber.Ctx) error {
    if ${item.upperParent}.${item.upperName} == nil {
      return errors.New("Need define ${item.upperParent}.${item.upperName}")
    }
    out, err := ${item.upperParent}.${item.upperName}()

    if err != nil {
      return err
    }

    return c.JSON(out)
  })`;
    }
  });
  return items.join("\n  ");
};

module.exports = {
  type: "go",
  buildType,
  buildInterface,
  buildHandle,
  buildCombine,
};
