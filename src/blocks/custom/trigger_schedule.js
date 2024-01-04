export default {
  type: "trigger_schedule",

  toolbox: {
    category: 'Triggers'
  },

  visualization: {
    "colour": 230,
  },

  connections: {
    mode: 'value',
    output: 'trigger'
  },

  lines: [
    [ "📅 Scheduled", 'CENTER' ],
    [ "Schedule", {
      field: 'CRONTAB',
      text: "* * * * *",
      spellcheck: false,
      align: 'CENTER'
    }]
  ],

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
