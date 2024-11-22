import { makeOptions } from "#app/util/fields.js"


export default {
  type: "every_day",

  toolbox: {
    category: 'Triggers',
    label: "Runs the Action every day on the specified hour."
  },

  visualization: {
    colour: 30,
    tooltip: "Run this action daily on the specified hour."
  },

  connections: {
    mode: "value",
    output: "cron_day"
  },

  lines: [
    [ "...every %FREQUENCY days", {
      align: 'LEFT',
      field: "FREQUENCY",
      options: makeOptions({ factorsOf: 30 })
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
      const { frequency } = blockObject.everyDay

      return {
        type: "every_day",
        fields: {
          FREQUENCY: frequency?.slice(2) || "1"
        }
      }
    }
  }
}
