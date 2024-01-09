import timeLines, { cronTime } from './lines/time'


export default {
  type: 'schedule_weekly',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 232,
  },

  connections: {
    mode: 'value',
    output: 'schedule'
  },

  lines: [
    ['Weekly', 'LEFT'],

    [ 'Sun', {
      field: 'SUN',
      checked: true,
    }],

    [ 'Mon', {
      field: 'MON',
      checked: true,
    }],

    [ 'Tue', {
      field: 'TUE',
      checked: true,
    }],

    [ 'Wed', {
      field: 'WED',
      checked: true,
    }],

    [ 'Thu', {
      field: 'THU',
      checked: true,
    }],

    [ 'Fri', {
      field: 'FRI',
      checked: true,
    }],

    [ 'Sat', {
      field: 'SAT',
      checked: true,
    }],

    ...timeLines
  ],

  generators: {
    json: block => {
      const
        time = cronTime(block),
        days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
          .reduce((days, day) => (
            block.getFieldValue(day) === "TRUE"
              ? days.concat(day)
              : days
          ), [])
          .join(',').toLowerCase()

      // TODO: validations
      // must select a day
      // if(!days.length) { }

      return [ `${time} * * ${days}` , 0 ]
    }
  }
}
