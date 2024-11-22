import { makeOptions } from "#app/util/fields.js"


export default {
  type: "every_hour",

  toolbox: {
    category: 'Triggers',
    label: "Runs the Action every hour at the specified minute."
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: "Run this action hourly at the minute specified."
  },

  connections: {
    mode: "value",
    output: "cron_hour"
  },

  lines: [
    [ "...every %FREQUENCY hours", {
      align: 'LEFT',
      field: "FREQUENCY",
      options: makeOptions({ factorsOf: 24 })
    }],
  ],

  generators: {
    json: block => {
      const frequency = block.getFieldValue('FREQUENCY')

      return [ `*/${frequency}`, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const { frequency } = blockObject.everyHour

      return {
        type: "every_hour",
        fields: {
          FREQUENCY: frequency?.slice(2) || "1"
        }
      }
    }
  }
}
