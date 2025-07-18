import mutator from './month_mutator.js'


export default {
  type: "all_months",
  name: "All Months",
  colour: 30,
  description: "Runs during all months.",

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  mutator,

  template: "Every month",

  generators: {
    json: block => {
      return [ '*', 0 ]
    }
  }
}
