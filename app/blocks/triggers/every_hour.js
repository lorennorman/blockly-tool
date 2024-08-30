import { map, range } from 'lodash-es'

export default {
  type: "every_hour",

  toolbox: {
    category: 'Triggers'
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: "Run this action hourly at the minute specified."
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  lines: [
    [ "...%FREQUENCY an hour, at minute %MINUTE", {
      align: 'LEFT',
      fields: {
        FREQUENCY: {
          options: [
            ["once", "once"],
            ["twice", "twice"],
          ]
        },
        MINUTE: {
          options: map(map(range(60), String), idx => ([ idx, idx ]))
        }
      }
    }],
  ],

  generators: {
    json: block => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        minute = block.getFieldValue('MINUTE'),
        cronMinutes = frequency === 'once'
          ? minute
          : `${minute%30}/30`

      return JSON.stringify({
        everyHour: {
          schedule: `${cronMinutes} * * * *`
        }
      })
    }
  },

  regenerators: {
    json: blockObject => {
      const
        { schedule } = blockObject.everyHour,
        cronMinutes = schedule.split(" ")[0],
        minute = cronMinutes.split('/')[0],
        frequency = cronMinutes.includes('/')
          ? 'twice'
          : 'once'

      return {
        type: "every_hour",
        fields: {
          MINUTE: minute,
          FREQUENCY: frequency,
        }
      }
    }
  }
}
