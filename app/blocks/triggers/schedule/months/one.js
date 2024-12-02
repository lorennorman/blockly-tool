export default {
  type: "one_month",

  visualization: {
    colour: 30,
    tooltip: "Runs during every month."
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  lines: [
    ["", {
      field: 'MONTH',
      options: [
        [ "January", '1' ],
        [ "February", '2' ],
        [ "March", '3' ],
        [ "April", '4' ],
      ]
    }]
  ],

  generators: {
    json: block => {
      const month = block.getFieldValue('MONTH')

      return [ month, 0 ]
    }
  }
}
