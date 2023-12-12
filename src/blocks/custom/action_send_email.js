export default {
  toolbox: {
    category: 'Actions',
  },

  json: {
    "type": "action_send_email",
    "message0": "📧 Send an Email %1",
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
    "message2": "Subject: %1",
    "args2": [
      {
        "type": "input_value",
        "name": "SUBJECT",
        "check": "String",
        "align": "RIGHT"
      }
    ],
    "message3": "Body: %1",
    "args3": [
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
    SUBJECT: {
      shadow: {
        type: 'text',
        fields: { TEXT: '{{ feed_name }} updated' }
      }
    },
    BODY: {
      shadow: {
        type: 'text_multiline',
        fields: {
          TEXT: [
            `ABC {{ feed_name }} DEF`,
            `XYZ {{ feed_value }} DEF`,
            `ABC {{ feed_name }} DEF`
          ].join('\n')
        }
      }
    },
  },

  generators: {
    json: (block, generator) => {
      const payload = {
        action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
        subject_template: generator.valueToCode(block, 'SUBJECT', 0) || "",
        body_template: generator.valueToCode(block, 'BODY', 0) || ""
      }

      return [ payload, 0 ]
    },

    markdown: (block, generator) => {
      return '# action_send_email.js'
    }
  }
}
