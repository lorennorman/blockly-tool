import { map, range } from 'lodash-es'


export default {
  type: 'selector_hours',

  toolbox: {
    // category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_hours_range'
  },

  lines: [
    [ "%HOUR_STEP hour(s) from %HOUR_START to %HOUR_END", {
      fields: {
        HOUR_STEP: {
          options: [
            [ "1", "1" ],
            [ "2", "2" ],
            [ "3", "3" ],
            [ "4", "4" ],
            [ "6", "6" ],
            [ "8", "8" ],
            [ "12", "12" ],
          ]
        },
        HOUR_START: {
          options: map(range(24), hour => ([ hour.toString(), (hour).toString() ]))
        },
        HOUR_END: {
          options: map(range(23, -1), hour => ([ hour.toString(), (hour).toString() ]))
        },
      }
    }]
  ],

  generators: {
    json: block => {
      const
        hourStart = block.getFieldValue('HOUR_START'),
        hourEnd = block.getFieldValue('HOUR_END'),
        hourStep = block.getFieldValue('HOUR_STEP'),

        hourRange = (hourStart === "0" && hourEnd === "23")
          ? "*"
          : `${hourStart}-${hourEnd}`,

        hourStepClause = hourStep === "1"
          ? ''
          : `/${hourStep}`

      return [ `${hourRange}${hourStepClause}` , 0 ]
    }
  }
}
