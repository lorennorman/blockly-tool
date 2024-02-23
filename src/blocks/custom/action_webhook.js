export default {
  type: "action_webhook",

  toolbox: {
    category: 'Actions',
    label: "POST a given body payload, templated from a given feed, to a given web URL."
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
      "FEED - the feed to use for the BODY template data",
    ].join('\n')
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  lines: [
    [ "🔗 Webhook", "CENTER" ],

    [ "...to URL:", {
      inputValue: "URL",
      // check: "String",
      shadow: {
        type: 'text',
        fields: { TEXT: 'https://...' }
      }
    }],

    [ "...POST body:", {
      inputValue: "BODY",
      // check: "String",
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
      // check: "feed",
      shadow: 'feed_selector'
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        webhookAction: {
          url: JSON.parse(generator.valueToCode(block, 'URL', 0)),
          feed: JSON.parse(generator.valueToCode(block, 'FEED', 0)),
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0)),
          formEncoded: block.getFieldValue('FORM_ENCODE') === 'TRUE'
        }
      }

      return JSON.stringify(payload)
    }
  }
}
