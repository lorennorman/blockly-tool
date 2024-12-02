export default {
  type: "all_months",

  visualization: {
    colour: 30,
    tooltip: "Runs during a particular month."
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  lines: [ "Every month" ],

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
