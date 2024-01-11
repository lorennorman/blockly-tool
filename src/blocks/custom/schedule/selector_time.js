import { map, range } from 'lodash-es'


export default {
  type: 'selector_time',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_minute_hour'
  },

  lines: [
    [ "Time of Day: %HOUR : %MINUTE %AM_PM", {
      fields: {
        HOUR: {
          options: map(range(1, 13), hour => ([ hour.toString(), (hour%12).toString() ]))
        },
        MINUTE: {
          options: map(map(range(60), String), idx => ([ idx, idx ]))
        },
        AM_PM: {
          options: [
            ["AM", "am"],
            ["PM", "pm"],
          ]
        }
      }
    }]
  ],

  generators: {
    json: block => {
      const
        isPm = block.getFieldValue('AM_PM') === "pm",
        hour = parseInt(block.getFieldValue('HOUR'), 10) + (isPm ? 12 : 0),
        minute = parseInt(block.getFieldValue('MINUTE'), 10)

      return [ `${minute} ${hour}` , 0 ]
    }
  }
}
