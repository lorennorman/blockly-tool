import { makeOptions } from "#app/util/fields.js"


export default {
  type: "one_minute",

  visualization: {
    colour: 30,
    tooltip: "Runs at a particular minute of the hour."
  },

  connections: {
    mode: 'value',
    output: 'cron_minute'
  },

  lines: [
    ["", {
      field: 'MINUTE',
      options: makeOptions({ from: 0, upTo: 59 })
    }]
  ],

  generators: {
    json: block => {
      const minute = block.getFieldValue('MINUTE')

      return [ minute, 0 ]
    }
  }
}
