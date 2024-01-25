export default {
  type: "action_send_email",

  toolbox: {
    category: 'Actions',
    label: "Send yourself an email with a given subject and body, templated from a given feed."
  },

  visualization: {
    colour: "0",
    tooltip: [
      "Sends an email with given SUBJECT and BODY, each templated with a given FEED",
      "---------------",
      "Parameters:",
      "SUBJECT - a template for generating the email subject",
      "BODY - a template for generating the email body",
      "FEED - the feed to pull template data from",
    ].join('\n'),
  },

  connections: {
    mode: "value",
    output: "action",
  },

  lines: [
    [ "📧 Email", 'CENTER'],

    [ "...subject:", {
      inputValue: "SUBJECT",
      check: 'String',
      shadow: {
        type: 'text',
        fields: { TEXT: '{{feed_name}} feed has a new value: {{value}}' }
      }
    }],

    [ "...body:", {
      inputValue: "BODY",
      check: 'String',
      shadow: {
        type: 'text_multiline',
        fields: { TEXT: 'The {{feed_name}} feed has a new value: {{value}} at {{created_at}}' }
      }
    }],

    [ "...using:", {
      inputValue: "FEED",
      check: 'feed',
      shadow: 'selector_feed',
    }],
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
