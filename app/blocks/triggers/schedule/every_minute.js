import { makeOptions } from "#app/util/fields.js"


export default {
  type: "every_minute",

  toolbox: {
    category: 'Triggers',
    label: "Runs the Action every few minutes."
  },

  visualization: {
    inputsInline: true,
    colour: 30,
    tooltip: "Runs the Action every few minutes."
  },

  connections: {
      mode: "value",
      output: "cron_minute"
    },

  lines: [
    [ "...every %FREQUENCY minutes", {
      align: 'LEFT',
      field: "FREQUENCY",
      options: makeOptions({ factorsOf: 60 })
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
      const { frequency } = blockObject.everyMinute

      return {
        type: "every_minute",
        fields: {
          FREQUENCY: frequency?.slice(2) || "1"
        }
      }
    }
  }
}
