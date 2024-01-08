import { map, times } from 'lodash-es'


export default {
  type: "schedule_hourly",

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
    [ "%1 an hour", {
      field: "FREQUENCY",
      options: [
        [ "Once", "once" ],
        [ "Twice", "twice" ],
      ]
    }],

    [ "at minute", {
      field: "AT_MINUTE",
      options: map(times(60, String), idx => ([ idx, idx ]))
    }]
  ],

  generators: {
    json: block => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        atMinute = parseInt(block.getFieldValue('AT_MINUTE'), 10),
        crontab = frequency === 'once'
          ? `${atMinute} * * * *`
          : `${atMinute%30}/30 * * * *`

      return [ crontab , 0 ]
    }
  }
}
