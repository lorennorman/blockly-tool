import { map, range } from 'lodash-es'


export default {
  type: 'selector_days',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_days_range'
  },

  lines: [
    [ "%DAY_STEP day(s) from %DAY_START to %DAY_END", {
      fields: {
        DAY_STEP: {
          options: map(range(1, 17), day => ([ day.toString(), (day).toString() ]))
        },
        DAY_START: {
          options: map(range(1, 32), day => ([ day.toString(), (day).toString() ]))
        },
        DAY_END: {
          options: map(range(31, -1), day => ([ day.toString(), (day).toString() ]))
        },
      }
    }]
  ],

  generators: {
    json: block => {
      const
        dayStart = block.getFieldValue('DAY_START'),
        dayEnd = block.getFieldValue('DAY_END'),
        dayStep = block.getFieldValue('DAY_STEP'),

        dayRange = (dayStart === "1" && dayEnd === "31")
          ? "*"
          : `${dayStart}-${dayEnd}`,

        dayStepClause = dayStep === "1"
          ? ''
          : `/${dayStep}`

      return [ `${dayRange}${dayStepClause}` , 0 ]
    }
  }
}
