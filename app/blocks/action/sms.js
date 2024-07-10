export default {
  type: "action_sms",

  toolbox: {
    category: 'Actions',
    label: "Send yourself a templated SMS, or text message."
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
              TEXT: [
                'The {{ vars.feed_name }} feed has a new',
                'value: {{ vars.feed_value }} at {{ vars.now }}'
              ].join('\n')
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
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0))
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
