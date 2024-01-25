export default {
  type: 'selector_day_of_week',

  toolbox: {
    // category: 'Schedules',
  },

  visualization: {
    colour: 190,
  },

  connections: {
    mode: 'value',
    output: 'cron_day_of_week'
  },

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
          .reduce((days, day) => (
            block.getFieldValue(day) === "TRUE"
              ? days.concat(day)
              : days
          ), []),
        // use * if it's everyday
        days = (selectedDays.length === 7)
          ? '*'
          : selectedDays.join(',').toLowerCase()

      return [ days , 0 ]
    }
  }
}
