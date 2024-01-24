import { map, range } from 'lodash-es'


export default {
  type: 'selector_day_of_month',

  toolbox: {
    // category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_day_of_month'
  },

  lines: [
    [ "Day of Month:", {
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
