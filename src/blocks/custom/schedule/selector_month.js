export default {
  type: 'selector_month',

  toolbox: {
    // category: 'Schedules',
  },

  visualization: {
    colour: 190,
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  lines: [
    [ "Month:", {
      field: 'MONTH',
      options: [
        [ 'Jan', 'JAN' ],
        [ 'Feb', 'FEB' ],
        [ 'Mar', 'MAR' ],
        [ 'Apr', 'APR' ],
        [ 'May', 'MAY' ],
        [ 'Jun', 'JUN' ],
        [ 'Jul', 'JUL' ],
        [ 'Aug', 'AUG' ],
        [ 'Sep', 'SEP' ],
        [ 'Oct', 'OCT' ],
        [ 'Nov', 'NOV' ],
        [ 'Dec', 'DEC' ]
      ]
    }],
  ],

  generators: {
    json: block => {
      const month = block.getFieldValue('MONTH').toLowerCase()

      return [ month, 0 ]
    }
  }
}
