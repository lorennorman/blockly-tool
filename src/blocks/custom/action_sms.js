export default {
  type: "action_sms",

  toolbox: {
    category: 'Actions',
    label: "Send yourself an SMS, or text message, with body templated from a given feed."
  },

  visualization: {
    colour: "0",
    tooltip: [
      "Sends a text message with a given BODY template using a given FEED",
      "---------------",
      "Parameters:",
      "BODY - a template for generating the SMS body",
      "FEED - the feed to pull template data from",
    ].join('\n')
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "📲 SMS", "CENTER" ],
    [ "(IO+ only)", "CENTER" ],

    [ "...body:", {
      inputValue: "BODY",
      check: "String",
      shadow: {
        type: 'text_multiline',
        fields: {
          TEXT: 'The {{feed_name}} feed has a new value: {{value}} at {{created_at}}'
        }
      }
    }],

    [ "...using:", {
      inputValue: "FEED",
      check: "feed",
      shadow: 'feed_selector'
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        smsAction: {
          feed: JSON.parse(generator.valueToCode(block, 'FEED', 0)),
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0))
        }
      }

      return JSON.stringify(payload)
    }
  }
}
