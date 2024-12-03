import { makeOptions } from "#app/util/fields.js"


export default {
  type: "one_hour",

  visualization: {
    colour: 20,
    tooltip: "Runs during a particular hour of the day."
  },

  connections: {
    mode: 'value',
    output: 'cron_hour'
  },

  lines: [
    ["During hour:", {
      field: 'HOUR',
      options: makeOptions({ upTo: 24 })
    }]
  ],

  generators: {
    json: block => {
      const hour = block.getFieldValue('HOUR')

      return [ hour, 0 ]
    }
  }
}
