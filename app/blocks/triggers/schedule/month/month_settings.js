export default {
  type: "month_settings",

  visualization: {
    colour: 30,
    tooltip: "How would you like to specify the months portion of your schedule?"
  },

  connections: {},

  lines: [
    [ "Month:", {
      inputValue: 'MONTH_BLOCK',
      check: 'cron_month',
      shadow: 'all_months'
    }],
  ],

  generators: {
    json: block => { }
  }
}
