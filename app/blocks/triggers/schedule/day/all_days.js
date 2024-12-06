const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./day_mutator.js?key=${random}`)).default

export default {
  type: "all_days",

  visualization: {
    colour: 40,
    tooltip: "Runs during every day of the month."
  },

  connections: {
    mode: 'value',
    output: 'cron_day'
  },

  mutator,

  lines: [ "Every day" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
