import { makeOptions } from "#app/util/fields.js"


export default {
  type: "one_minute",

  visualization: {
    colour: 10,
    tooltip: "Runs at a particular minute of the hour."
  },

  connections: {
    mode: 'value',
    output: 'cron_minute'
  },

  lines: [
    ["At minute:", {
      field: 'MINUTE',
      options: makeOptions({ upTo: 60 })
    }]
  ],

  generators: {
    json: block => {
      const minute = block.getFieldValue('MINUTE')

      return [ minute, 0 ]
    }
  }
}
