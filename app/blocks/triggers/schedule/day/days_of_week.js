const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./day_mutator.js?key=${random}`)).default

export default {
  type: "days_of_week",

  visualization: {
    colour: 30,
    tooltip: "Runs during certain days of the week."
  },

  connections: {
    mode: 'value',
    output: 'cron_day'
  },

  mutator,

  lines: [
    [ 'Sun: %SUN Mon: %MON Tue: %TUE Wed: %WED', {
      fields: {
        SUN: { checked: true },
        MON: { checked: true },
        TUE: { checked: true },
        WED: { checked: true },
      }
    } ],

    [ 'Thu: %THU Fri: %FRI Sat: %SAT', {
      align: 'CENTER',
      fields: {
        THU: { checked: true },
        FRI: { checked: true },
        SAT: { checked: true }
      }
    } ],
  ],

  generators: {
    json: block => {
      const
        selectedDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
          .reduce((days, day, index) => (
            block.getFieldValue(day) === "TRUE"
              ? days.concat(index)
              : days
          ), []),
        // use * if it's everyday, or no days
        // TODO: use a validator to ensure at least 1 day is set
        days = (selectedDays.length === 7 || selectedDays.length === 0)
          ? '*'
          : `w${selectedDays.join(',')}`

      return [ days , 0 ]
    }
  }
}
