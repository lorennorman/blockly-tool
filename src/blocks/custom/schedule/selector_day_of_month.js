import { map, range } from 'lodash-es'


export default {
  type: 'selector_day_of_month',

  toolbox: {
    // category: 'Schedules',
  },

  visualization: {
    colour: 190,
    tooltip: "Remember: some months are missing dates above 28."
  },

  connections: {
    mode: 'value',
    output: 'cron_day_of_month'
  },

  lines: [
    [ "Date", {
      field: "DAY_OF_MONTH",
      options: map(range(1, 29), date => [ date.toString(), date.toString() ])
    }],
  ],

  generators: {
    json: block => {
      const day = parseInt(block.getFieldValue('DAY_OF_MONTH'), 10)

      return [ day , 0 ]
    }
  }
}
