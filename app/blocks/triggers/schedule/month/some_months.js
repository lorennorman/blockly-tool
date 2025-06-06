const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./month_mutator.js?key=${random}`)).default

export default {
  type: 'some_months',

  visualization: {
    colour: 30,
    tooltip: "Run during particular months."
  },

  connections: {
    mode: 'value',
    output: 'cron_month'
  },

  mutator,

  lines: [
    [ 'Jan: %JAN Feb: %FEB Mar: %MAR Apr: %APR', {
      align: 'CENTER',
      fields: {
        JAN: { checked: false },
        FEB: { checked: false },
        MAR: { checked: false },
        APR: { checked: false }
      },
    }],

    [ 'May: %MAY Jun: %JUN Jul: %JUL Aug: %AUG', {
      align: 'CENTER',
      fields: {
        MAY: { checked: false },
        JUN: { checked: false },
        JUL: { checked: false },
        AUG: { checked: false },
      }
    }],

    [ 'Sep: %SEP Oct: %OCT Nov: %NOV Dec: %DEC', {
      align: 'CENTER',
      fields: {
        SEP: { checked: false },
        OCT: { checked: false },
        NOV: { checked: false },
        DEC: { checked: false },
      }
    }]
  ],

  generators: {
    json: block => {
      const
        MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ],
        selectedMonths = MONTHS.reduce((months, month) => (
            block.getFieldValue(month) === "TRUE"
              ? months.concat(month)
              : months
          ), []),
        months = selectedMonths.join(',').toLowerCase()
        // TODO: use a validator to ensure at least 1 month is set

      return [ months, 0 ]
    }
  }
}
