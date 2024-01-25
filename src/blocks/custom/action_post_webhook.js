export default {
  type: "action_post_webhook",

  toolbox: {
    category: 'Actions',
    label: "POST a given body payload, templated from a given feed, to a given web URL."
  },

  visualization: {
    colour: "0",
  },

  connections: {
    mode: "value",
    output: "action",
  },

  lines: [
    [ "🔗 Webhook", "CENTER" ],

    [ "...to URL:", {
      inputValue: "URL",
      check: "String",
      shadow: {
        type: 'text',
        fields: { TEXT: 'https://...' }
      }
    }],

    [ "...POST body:", {
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

    [ "...using:", {
      inputValue: "FEED",
      check: "feed",
      shadow: 'selector_feed'
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
