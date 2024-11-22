import { makeOptions } from '#app/util/fields.js'


export default {
  type: "every_month",

  toolbox: {
    label: "Specify the months the Action will run."
  },

  visualization: {
    colour: 30,
    tooltip: "Specify the months the Action will run."
  },

  connections: {
    mode: "value",
    output: "cron_month"
  },

  lines: [
    [ "...every %FREQUENCY months", {
      align: 'LEFT',
      field: "FREQUENCY",
      options: makeOptions({ factorsOf: 12 })
    }],
  ],

  generators: {
    json: block => {
      const frequency = block.getFieldValue('FREQUENCY')

      return [`*/${frequency}`, 0]
    }
  },

  regenerators: {
    json: blockObject => {
      const { frequency } = blockObject.everyMonth

      return {
        type: "every_month",
        fields: {
          FREQUENCY: frequency?.slice(2) || "1"
        }
      }
    }
  }
}
