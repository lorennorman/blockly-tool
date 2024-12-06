import { makeOptions } from "#app/util/fields.js"

const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./day_mutator.js?key=${random}`)).default


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

  mutator,

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
