export default {
  toolbox: {
    category: 'Actions',
  },

  json: {
    "type": "action_send_sms",
    "message0": "📲 Send an SMS %1",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message1": "Select a Feed: %1",
    "args1": [
      {
        "type": "input_value",
        "name": "FEED",
        "check": "feed",
        "align": "RIGHT"
      }
    ],
    "message2": "Body: %1",
    "args2": [
      {
        "type": "input_value",
        "name": "BODY",
        "check": "String",
        "align": "RIGHT"
      }
    ],
    "inputsInline": false,
    "output": "action",
    "colour": 345,
    "tooltip": "",
    "helpUrl": ""
  },

  inputs: {
    FEED: {
      shadow: {
        type: 'selector_feed'
      }
    },
    BODY: {
      shadow: {
        type: 'text_multiline',
        fields: {
          TEXT: 'The {{feed_name}} feed has a new value: {{value}} at {{created_at}}'
        }
      }
    },
  },

  generators: {
    json: (block, generator) => {
      const payload = {
        action: 'sms',
        action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
        body_template: generator.valueToCode(block, 'BODY', 0) || ""
      }

      return [ payload, 0 ]
    },

    markdown: (block, generator) => {
      return '# action_send_sms.js'
    }
  }
}
