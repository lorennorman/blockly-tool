import { makeOptions } from "#app/util/fields.js"


export default {
  type: "one_day",

  visualization: {
    colour: 30,
    tooltip: [
      "Runs during a particular day of the month.",
      "Remember: not all months have days after 28!"
    ].join("\n")
  },

  connections: {
    mode: 'value',
    output: 'cron_day'
  },

  lines: [
    ["On date:", {
      field: 'DAY',
      options: makeOptions({ from: 1, upTo: 31 })
    }]
  ],

  generators: {
    json: block => {
      const day = block.getFieldValue('DAY')

      return [ day, 0 ]
    }
  }
}
