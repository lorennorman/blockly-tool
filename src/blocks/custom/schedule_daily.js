import { map, range } from 'lodash-es'


export default {
  type: "schedule_daily",

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 232,
  },

  connections: {
    mode: "value",
    output: "schedule"
  },

  lines: [
    [ "Daily", "LEFT" ],

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
        atHour = parseInt(block.getFieldValue('AT_HOUR'), 10) + (isPm ? 12 : 0),
        atMinute = parseInt(block.getFieldValue('AT_MINUTE'), 10),
        crontab = `${atMinute} ${atHour} * * *`

      return [ crontab , 0 ]
    }
  }
}
