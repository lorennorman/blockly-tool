export default {
  type: "one_month",

  visualization: {
    colour: 30,
    tooltip: "Runs during a particular month."
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
        [ "May", '5' ],
        [ "June", '6' ],
        [ "July", '7' ],
        [ "August", '8' ],
        [ "September", '9' ],
        [ "October", '10' ],
        [ "November", '11' ],
        [ "December", '12' ],
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
