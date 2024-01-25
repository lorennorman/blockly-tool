export default {
  type: "action_send_sms",

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
    mode: "value",
    output: "action",
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
      shadow: 'selector_feed'
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        action: 'sms',
        action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
        body_template: generator.valueToCode(block, 'BODY', 0) || ""
      }

      return [ payload, 0 ]
    }
  }
}
