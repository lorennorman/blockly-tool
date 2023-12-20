export default {
  type: "action_send_email",

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

  data: {
    inputValues: {
      FEED: {
        check: 'feed',
        shadow: 'selector_feed',
      },
      SUBJECT: {
        check: 'String',
        shadow: {
          type: 'text',
          fields: { TEXT: '{{feed_name}} feed has a new value: {{value}}' }
        }
      },
      BODY: {
        check: 'String',
        shadow: {
          type: 'text_multiline',
          fields: { TEXT: 'The {{feed_name}} feed has a new value: {{value}} at {{created_at}}' }
        }
      },
    }
  },

  lines: [
    { center: "📧 Send an Email" },
    "Select a Feed: %FEED",
    "Subject: %SUBJECT",
    "Body: %BODY",
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        action: 'email',
        action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
        subject_template: generator.valueToCode(block, 'SUBJECT', 0) || "",
        body_template: generator.valueToCode(block, 'BODY', 0) || ""
      }

      return [ payload, 0 ]
    }
  }
}
