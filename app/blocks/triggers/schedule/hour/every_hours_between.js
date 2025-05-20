import { makeOptions } from "#app/util/fields.js"

const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./hour_mutator.js?key=${random}`)).default

export default {
  type: "every_hours_between",

  visualization: {
    colour: 30,
    tooltip: "Runs every X hours, between hours Y and Z."
  },

  connections: {
    mode: 'value',
    output: 'cron_hour'
  },

  mutator,

  lines: [
    ["Every %FREQUENCY hours between %START and %END", {
      fields: {
        FREQUENCY: { options: makeOptions({ factorsOf: 24 }) },

        START: { options: makeOptions({ upTo: 24 }) },

        END: { options: makeOptions({ upTo: 24, reverse: true }) }
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
