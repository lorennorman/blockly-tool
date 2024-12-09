import { makeOptions } from "#app/util/fields.js"

const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./minute_mutator.js?key=${random}`)).default

export default {
  type: "every_minutes_between",

  visualization: {
    colour: 30,
    tooltip: "Runs every X minutes, between minutes Y and Z."
  },

  connections: {
    mode: 'value',
    output: 'cron_minute'
  },

  mutator,

  lines: [
    ["Every %FREQUENCY minutes between %START and %END", {
      fields: {
        FREQUENCY: { options: makeOptions({ factorsOf: 60 }) },

        START: { options: makeOptions({ upTo: 60 }) },

        END: { options: makeOptions({ upTo: 60, reverse: true }) }
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
