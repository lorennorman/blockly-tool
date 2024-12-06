import { makeOptions } from "#app/util/fields.js"

const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./minute_mutator.js?key=${random}`)).default

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

  mutator,

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
