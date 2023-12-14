export default {
  toolbox: {
    category: 'Actions',
  },

  json: {
    "type": "action_post_webhook",
    "message0": "🔗 POST a Webhook %1",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message1": "Web URL: %1",
    "args1": [
      {
        "type": "input_value",
        "name": "URL",
        "check": "String",
        "align": "RIGHT"
      }
    ],
    "message2": "Select a Feed: %1",
    "args2": [
      {
        "type": "input_value",
        "name": "FEED",
        "check": "feed",
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
    "message4": "Form Encode? %1 %2",
    "args4": [
      {
        "type": "field_checkbox",
        "name": "FORM_ENCODE",
        "checked": false
      }, {
        "type": "input_dummy",
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
    URL: {
      shadow: {
        type: 'text',
        fields: { TEXT: 'https://...' }
      }
    },
    FEED: {
      shadow: {
        type: 'selector_feed'
      }
    },
    BODY: {
      shadow: {
        type: 'text_multiline',
        fields: {
          TEXT:
`[
  {
    "id": "{{id}}",
    "value": "{{value}}",
    "feed_id": {{feed_id}},
    "feed_name": "{{feed_name}}",
    "feed_key": "{{feed_key}}",
    "location": {
      "lat": {{lat}},
      "lon": {{lon}},
      "ele": {{ele}}
    },
    "created_at": "{{created_at}}",
    "updated_at": "{{updated_at}}",
    "expiration": {{expiration}}
  }
]`
        }
      }
    }
  },

  generators: {
    json: (block, generator) => {
      const payload = {
        action: 'webhook',
        action_value: generator.valueToCode(block, 'URL', 0) || null,
        action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
        body_template: generator.valueToCode(block, 'BODY', 0) || "",
        form_encoded: block.getFieldValue('FORM_ENCODE') === 'TRUE'
      }

      return [ payload, 0 ]
    }
  }
}
