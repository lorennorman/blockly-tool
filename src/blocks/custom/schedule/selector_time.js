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
    [ "...at hour:", {
      field: "AT_HOUR",
      options: map(range(1, 13), hour => ([ hour.toString(), (hour%12).toString() ]))
    }],

    [ "...at minute:", {
      field: "AT_MINUTE",
      options: map(map(range(60), String), idx => ([ idx, idx ]))
    }],

    [ "", {
      field: "AM_PM",
      options: [
        ["AM", "am"],
        ["PM", "pm"],
      ]
    }]
  ],

  generators: {
    json: block => {
      const
        isPm = block.getFieldValue('AM_PM') === "pm",
        hour = parseInt(block.getFieldValue('AT_HOUR'), 10) + (isPm ? 12 : 0),
        minute = parseInt(block.getFieldValue('AT_MINUTE'), 10)

      return [ `${minute} ${hour}` , 0 ]
    }
  }
}
