import { map, range } from 'lodash-es'
import timeLines, { cronTime } from '../lines/time.js'


export default {
  type: 'schedule_monthly',

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
    [ "Monthly", "LEFT" ],

    ...timeLines,

    // TODO: extract lines/days
    [ "...on day:", {
      field: "DAY_OF_MONTH",
      options: map(range(1, 29), date => [ date.toString(), date.toString() ])
    }],

    [ '...of months:', 'CENTER' ],

    // TODO: extract lines/month, { monthCheckboxes? }
    [ 'Jan', {
      field: 'JAN',
      checked: true,
    }],

    [ 'Feb', {
      field: 'FEB',
      checked: true,
    }],

    [ 'Mar', {
      field: 'MAR',
      checked: true,
    }],

    [ 'Apr', {
      field: 'APR',
      checked: true,
    }],

    [ 'May', {
      field: 'MAY',
      checked: true,
    }],

    [ 'Jun', {
      field: 'JUN',
      checked: true,
    }],

    [ 'Jul', {
      field: 'JUL',
      checked: true,
    }],

    [ 'Aug', {
      field: 'AUG',
      checked: true,
    }],

    [ 'Sep', {
      field: 'SEP',
      checked: true,
    }],

    [ 'Oct', {
      field: 'OCT',
      checked: true,
    }],

    [ 'Nov', {
      field: 'NOV',
      checked: true,
    }],

    [ 'Dec', {
      field: 'DEC',
      checked: true,
    }]
  ],

  generators: {
    json: block => {
      const
        time = cronTime(block),
        day = parseInt(block.getFieldValue('DAY_OF_MONTH'), 10),
        months = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
          .reduce((months, month) => (
            block.getFieldValue(month) === "TRUE"
              ? months.concat(month)
              : months
          ), [])
          .join(',').toLowerCase()

    // TODO: validations
    // must select a day
    // if(!days.length) { }

    return [ `${time} ${months} ${day} *` , 0 ]
    // return [ `* * * * *` , 0 ]
    }
  }
}
