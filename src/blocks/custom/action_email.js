export default {
  type: "action_email",

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
    mode: "statement",
    output: "expression",
    next: 'expression'
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
      shadow: 'feed_selector',
    }],
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        emailAction: {
          feed: JSON.parse(generator.valueToCode(block, 'FEED', 0)), // || null,
          subjectTemplate: JSON.parse(generator.valueToCode(block, 'SUBJECT', 0)), // || "",
          bodyTemplate: JSON.parse(generator.valueToCode(block, 'BODY', 0)) // || ""
        }
      }

      return JSON.stringify(payload)
    }
  }
}
