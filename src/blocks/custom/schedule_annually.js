import { map, range } from 'lodash-es'
import timeLines, { cronTime } from './lines/time.js'


export default {
  type: 'schedule_annually',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 208,
  },

  connections: {
    mode: 'value',
    output: 'schedule'
  },

  lines: [
    [ "Annually", "LEFT" ],

    // TODO: extract lines/month, { monthOptions? }
    [ "...on month:", {
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

    ...timeLines,

    // TODO: extract lines/days, { dayOfMonth }
    [ "...on day:", {
      field: "DAY_OF_MONTH",
      options: map(range(1, 29), date => [ date.toString(), date.toString() ])
    }],

  ],

  generators: {
    json: block => {
      const
        months = block.getFieldValue('MONTH').toLowerCase(),
        timeCrontab = cronTime(block),
        day = parseInt(block.getFieldValue('DAY_OF_MONTH'), 10)

      return [ `${timeCrontab} ${months} ${day} *` , 0 ]
    }
  }
}
