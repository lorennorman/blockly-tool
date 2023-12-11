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
      const payload = {
        action_feed_id: generator.valueToCode(block, 'FEED', 0) || null,
        subject_template: block.getFieldValue('EMAIL_SUBJECT'),
        body_template: block.getFieldValue('EMAIL_BODY')
      }

      return [ payload, 0]
    },

    markdown: (block, generator) => {
      return '# action_send_email.js'
    }
  }
}
