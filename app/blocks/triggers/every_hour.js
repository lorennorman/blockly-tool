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
    [ "...%OCCURRENCES an hour, at minute %MINUTE", {
      align: 'LEFT',
      fields: {
        OCCURRENCES: {
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
        payload = JSON.stringify({
          minute
        })

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.minute

      return {
        type: "every_hour",
        fields: {
          MINUTE: payload.minute
        }
      }
    }
  }
}
