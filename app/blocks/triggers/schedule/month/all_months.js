const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./month_mutator.js?key=${random}`)).default

export default {
  type: "all_months",

  visualization: {
    colour: 50,
    tooltip: "Runs during all months."
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  mutator,

  lines: [ "Every month" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
