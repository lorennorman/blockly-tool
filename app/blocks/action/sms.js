export default {
  type: "action_sms",

  toolbox: {
    category: 'Actions',
  },

  visualization: {
    colour: "0",
    tooltip: [
      "(IO+ only)",
      "Sends a text message with a given BODY template.",
      "---------------",
      "Parameters:",
      "BODY - a template for generating the SMS body",
    ].join('\n')
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "📲 SMS", "CENTER" ],

    [ "Message:", {
      inputValue: "BODY",
      // check: "String",
      shadow: {
        type: 'text_template',
        inputs: { TEMPLATE: {
          shadow: {
            type: 'io_text_multiline',
            fields: {
              TEXT: '                     \n\n\n'
            }
          }
        }}
      }
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        smsAction: {
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0) || null)
        }
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.smsAction

      return {
        type: "action_sms",
        inputs: {
          // TODO: regenerators need to support nested shadow blocks
          BODY: helpers.expressionToBlock(payload.bodyTemplate, { shadow: 'text_template' })
        }
      }
    }
  }
}
