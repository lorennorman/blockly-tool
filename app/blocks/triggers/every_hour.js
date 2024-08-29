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
        minute = block.getFieldValue('MINUTE'),
        frequency = block.getFieldValue('FREQUENCY'),
        payload = JSON.stringify({
          everyHour: { minute, frequency }
        })

      return payload
    }
  },

  regenerators: {
    json: blockObject => {
      const { minute, frequency } = blockObject.everyHour

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
