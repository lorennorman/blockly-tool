const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./minute_mutator.js?key=${random}`)).default


export default {
  type: "all_minutes",

  visualization: {
    colour: 10,
    tooltip: "Runs every minute of the hour."
  },

  connections: {
    mode: 'value',
    output: 'cron_minute'
  },

  mutator,

  lines: [ "Every minute" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
