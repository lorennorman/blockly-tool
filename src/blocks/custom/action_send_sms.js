export default {
  type: "action_send_sms",

  toolbox: {
    category: 'Actions',
  },

  visualization: {
    colour: 345
  },

  connections: {
    mode: "value",
    output: "action",
  },

  lines: [
    [ "📲 Send an SMS", "CENTER" ],

    [ "Select a Feed:", {
      inputValue: "FEED",
      check: "feed",
      shadow: 'selector_feed'
    }],

    [ "Body:", {
      inputValue: "BODY",
      check: "String",
      shadow: {
        type: 'text_multiline',
        fields: {
          TEXT: 'The {{feed_name}} feed has a new value: {{value}} at {{created_at}}'
        }
      }
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
