const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./hour_mutator.js?key=${random}`)).default


export default {
  type: "all_hours",

  visualization: {
    colour: 20,
    tooltip: "Runs during all hours of the day."
  },

  connections: {
    mode: 'value',
    output: 'cron_hour'
  },

  mutator,

  lines: [ "Every hour" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
