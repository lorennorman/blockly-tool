export default {
  type: 'selector_month',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  lines: [
    [ "Month:", {
      field: 'MONTH',
      options: [
        [ 'Jan', '1' ],
        [ 'Feb', '2' ],
        [ 'Mar', '3' ],
        [ 'Apr', '4' ],
        [ 'May', '5' ],
        [ 'Jun', '6' ],
        [ 'Jul', '7' ],
        [ 'Aug', '8' ],
        [ 'Sep', '9' ],
        [ 'Oct', '10' ],
        [ 'Nov', '11' ],
        [ 'Dec', '12' ]
      ]
    }],
  ],

  generators: {
    json: block => {
      const month = block.getFieldValue('MONTH')

      return [ month, 0 ]
    }
  }
}
