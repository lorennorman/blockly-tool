export default {
  type: "all_hours",

  visualization: {
    colour: 30,
    tooltip: "Runs during all hours of the day."
  },

  connections: {
    mode: 'value',
    output: 'cron_hour'
  },

  lines: [ "Every hour" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
