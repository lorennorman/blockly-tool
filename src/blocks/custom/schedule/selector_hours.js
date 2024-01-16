import { map, range } from 'lodash-es'


export default {
  type: 'selector_hours',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_hours_range'
  },

  lines: [
    [ "%HOUR_STEP hours from %HOUR_START to %HOUR_END", {
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
          options: map(range(24), hour => ([ hour.toString(), (hour).toString() ])),
          value: "23"
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

        hourRange = ([ hourStart, hourEnd ] == [ "0", "23" ])
          ? "*"
          : `${hourStart}-${hourEnd}`,

        hourStepClause = hourStep === "1"
          ? ''
          : `/${hourStep}`

      return [ `${hourRange}${hourStepClause}` , 0 ]
    }
  }
}
