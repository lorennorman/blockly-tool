export const
  toolbox = {
    category: 'Actions',
  },

  json = {
    "type": "action_send_email",
    "message0": "Send an Email %1 To: %2 %3 Subject: %4 %5 Body: %6",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
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
        "text": "A Great Subject"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "EMAIL_BODY",
        "text": "body with {{ value }}"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 345,
    "tooltip": "",
    "helpUrl": ""
  },

  generators = {
    json: (block, generator) => {
      return '{ "message": "JSON not implemented for action_send_email.js"'
    },

    markdown: (block, generator) => {
      return '# action_send_email.js'
    }
  }
