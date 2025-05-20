import { makeOptions } from "#app/util/fields.js"

const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./day_mutator.js?key=${random}`)).default

export default {
  type: "every_days_between",

  visualization: {
    colour: 30,
    tooltip: "Runs every X days, between days Y and Z."
  },

  connections: {
    mode: 'value',
    output: 'cron_day'
  },

  mutator,

  lines: [
    ["Every %FREQUENCY days between %START and %END", {
      fields: {
        FREQUENCY: { options: makeOptions({ factorsOf: 30 }) },

        START: { options: makeOptions({ from: 1, upTo: 32 }) },

        END: { options: makeOptions({ from: 1, upTo: 32, reverse: true }) }
      }
    }]
  ],

  generators: {
    json: block => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        start = block.getFieldValue('START'),
        end = block.getFieldValue('END'),
        cronString = `${start}-${end}/${frequency}`

      return [ cronString, 0 ]
    }
  }
}
