export default {
  type: "action_email",

  toolbox: {
    category: 'Actions',
    label: "Send yourself an email with custom subject and body templates."
  },

  visualization: {
    colour: "0",
    tooltip: [
      "Sends an email with given SUBJECT and BODY",
      "---------------",
      "Parameters:",
      "SUBJECT - a template for generating the email subject",
      "BODY - a template for generating the email body",
    ].join('\n'),
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "📧 Email", 'CENTER'],

    [ "Subject:", {
      inputValue: "SUBJECT",
      shadow: {
        type: 'text_template',
        inputs: { TEMPLATE: {
          shadow: {
            type: 'io_text',
            fields: {
              TEXT: '{{ vars.feed_name }} feed has a new value: {{ vars.feed_value }}'
            }
          }
        }}
      }
    }],

    [ "Body:", {
      inputValue: "BODY",
      // check: 'String',
      shadow: {
        type: 'text_template',
        inputs: { TEMPLATE: {
          shadow: {
            type: 'io_text_multiline',
            fields: {
              TEXT: 'Hello!\nThe {{ vars.feed_name }} feed has a new value: {{ vars.value }}\nProcessed at: {{ vars.now }}'
            }
          }
        }}
      }
    }]
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        emailAction: {
          subjectTemplate: JSON.parse(generator.valueToCode(block, 'SUBJECT', 0) || null),
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0) || null)
        }
      }

      return JSON.stringify(payload)
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const payload = blockObject.emailAction

      return {
        type: "action_email",
        inputs: {
          // TODO: regenerators need to support nested shadow blocks
          SUBJECT: helpers.expressionToBlock(payload.subjectTemplate, { shadow: 'text_template' }),
          BODY: helpers.expressionToBlock(payload.bodyTemplate, { shadow: 'text_template' })
        }
      }
    }
  }
}
