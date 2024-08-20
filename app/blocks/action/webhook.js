export default {
  type: "action_webhook",

  toolbox: {
    category: 'Actions',
    label: "POST a given body template to a given web URL."
  },

  visualization: {
    colour: "0",
    tooltip: [
      "Sends an HTTP POST request to a given URL, with a BODY template using FEED data.",
      "---------------",
      "Parameters:",
      "URL - a valid web location to send a request to",
      "BODY - a JSON template to render and POST",
      "FORM_ENCODE - optionally encode as form input",
    ].join('\n')
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "🔗 Webhook", "CENTER" ],

    [ "URL:", {
      inputValue: "URL",
      // check: "String",
      shadow: {
        type: 'io_text',
        fields: { TEXT: 'https://...' }
      }
    }],

    [ "Form Encode?", {
      field: "FORM_ENCODE",
      checked: false
    }],

    [ "POST Body:", {
      inputValue: "BODY",
      // check: "String",
      shadow: {
        type: 'text_template',
        inputs: {
          TEMPLATE: {
            shadow: {
              type: 'io_text_multiline',
              fields: {
                TEXT:
`{
  "id": "{{ vars.feed_id }}",
  "value": "{{ vars.feed_value }}"
}`
              }
            }
          }
        }
      }
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        webhookAction: {
          url: JSON.parse(generator.valueToCode(block, 'URL', 0)),
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0)),
          formEncoded: block.getFieldValue('FORM_ENCODE') === 'TRUE'
        }
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.webhookAction

      return {
        type: "action_webhook",
        inputs: {
          URL: helpers.expressionToBlock(payload.url, { shadow: 'io_text' }),
          BODY: helpers.expressionToBlock(payload.bodyTemplate, { shadow: 'io_text_multiline' }),
        },
        fields: {
          FORM_ENCODE: payload.formEncoded ? 'TRUE' : 'FALSE'
        }
      }
    }
  }
}
