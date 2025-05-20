import { makeOptions } from "#app/util/fields.js"

const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./month_mutator.js?key=${random}`)).default

export default {
  type: "every_months_between",

  visualization: {
    colour: 30,
    tooltip: "Runs every X months, between months Y and Z."
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  mutator,

  lines: [
    ["Every %FREQUENCY months between %START and %END", {
      fields: {
        FREQUENCY: { options: makeOptions({ factorsOf: 12 }) },

        START: { options: makeOptions({ from: 1, upTo: 13 }) },

        END: { options: makeOptions({ from: 1, upTo: 13, reverse: true }) }
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
