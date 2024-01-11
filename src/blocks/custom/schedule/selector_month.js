export default {
  type: 'selector_month',

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
      const months = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
        .reduce((months, month) => (
          block.getFieldValue(month) === "TRUE"
            ? months.concat(month)
            : months
        ), [])
        .join(',').toLowerCase()

      return [ months, 0 ]
    }
  }
}
