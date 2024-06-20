export default {
  type: 'text_template',

  toolbox: {
    category: 'Text',
  },

  visualization: {
    inputsInline: true,
    helpUrl: "https://shopify.github.io/liquid/basics/introduction/",
    colour: 180,
    tooltip: [
      "Render a text template. Special forms surrounded by {{ curly_braces }}",
      "will be replaced with their current value during the action run.",
      "-",
      "Inputs:",
      "---------------",
      "Text - the text to render with the template engine",
      "-",
      "Casting:",
      "---------------",
      "the input is coerced to a string",
      "-",
    ].join('\n'),
  },

  lines: [
    ["{% %1 %}", { inputValue: 'TEMPLATE', shadow: 'text_multiline' }],
  ],

  generators: {
    json: (block, generator) => {
      const
        template = generator.valueToCode(block, 'TEMPLATE', 0) || null,

        blockPayload = JSON.stringify({
          textTemplate: {
            template: JSON.parse(template)
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { template } = blockObject.textTemplate,
        inputs = {
          TEMPLATE: helpers.expressionToBlock(template, { shadow: 'text' })
        }

      return { type: 'text_template', inputs }
    }
  }
}
