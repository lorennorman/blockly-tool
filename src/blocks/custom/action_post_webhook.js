export default {
  type: "action_post_webhook",

  toolbox: {
    category: 'Actions',
  },

  visualization: {
    colour: 345,
  },

  connections: {
    mode: "value",
    output: "action",
  },

  lines: [
    [ "🔗 POST a Webhook", "CENTER" ],

    [ "Web URL:", {
      inputValue: "URL",
      check: "String",
      shadow: {
        type: 'text',
        fields: { TEXT: 'https://...' }
      }
    }],

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
    }],

    [ "Form Encode?", {
      field: "FORM_ENCODE",
      checked: false
    }],
  ],

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
