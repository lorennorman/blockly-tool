
export default {
  toolbox: {
    category: 'Triggers'
  },

  json: {
    "type": "trigger_schedule",
    "message0": "📅 Scheduled %1",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message1": "Schedule %1 %2",
    "args1": [
      {
        "type": "field_input",
        "name": "CRONTAB",
        "text": "* * * * *",
        "spellcheck": false
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "inputsInline": false,
    "output": "trigger",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },

  inputs: { },

  generators: {
    json: (block, generator) => {
      const
        payload = {
          trigger_type: 'schedule',
          value: block.getFieldValue('CRONTAB')
        }

      return [ payload, 0 ]
    }
  }
}
