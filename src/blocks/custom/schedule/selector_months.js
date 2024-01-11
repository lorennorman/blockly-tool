export default {
  type: 'selector_months',

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
    [ 'Jan: %JAN Feb: %FEB Mar: %MAR Apr: %APR', {
      align: 'CENTER',
      fields: {
        JAN: { checked: true },
        FEB: { checked: true },
        MAR: { checked: true },
        APR: { checked: true }
      },
    }],

    [ 'May: %MAY Jun: %JUN Jul: %JUL Aug: %AUG', {
      align: 'CENTER',
      fields: {
        MAY: { checked: true },
        JUN: { checked: true },
        JUL: { checked: true },
        AUG: { checked: true },
      }
    }],

    [ 'Sep: %SEP Oct: %OCT Nov: %NOV Dec: %DEC', {
      align: 'CENTER',
      fields: {
        SEP: { checked: true },
        OCT: { checked: true },
        NOV: { checked: true },
        DEC: { checked: true },
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
        // use * if every month is selected
        months = (selectedMonths.length === MONTHS.length)
          ? "*"
          : selectedMonths.join(',').toLowerCase()

      return [ months, 0 ]
    }
  }
}
