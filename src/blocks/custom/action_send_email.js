export default {
  toolbox: {
    category: 'Actions',
  },

  json: {
    "type": "action_send_email",
    "message0": "Send an Email %1 Select a Feed: %2 To: %3 %4 Subject: %5 %6 Body: %7",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "FEED",
        "check": "feed",
        "align": "RIGHT"
      },
      {
        "type": "field_dropdown",
        "name": "EMAIL_ADDRESS",
        "options": [
          [
            "me@example.com",
            "email_id_1"
          ],
          [
            "my@otheremail.com",
            "email_id_2"
          ],
          [
            "...",
            "OPTIONNAME"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "EMAIL_SUBJECT",
        "text": "{{feed_name}} updated"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "EMAIL_BODY",
        "text": "{{feed_name}} got value {{value}} at {{created_at}}"
      }
    ],
    "output": "action",
    "colour": 345,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const
        email = block.getFieldValue('EMAIL_ADDRESS'),
        subject = block.getFieldValue('EMAIL_SUBJECT'),
        body = block.getFieldValue('EMAIL_BODY'),

        lines = [
          `"action": "send_email"`,
          `"address": "${email}"`,
          `"subject": "${subject}"`,
          `"body": "${body}"`,
        ],

        indentedLines = generator.prefixLines(lines.join(',\n'), generator.INDENT)

      return `{\n${indentedLines}\n}`
    },

    markdown: (block, generator) => {
      return '# action_send_email.js'
    }
  }
}
