import { minuteLine, cronMinute } from './lines/time'


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

    minuteLine
  ],

  generators: {
    json: block => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        minutes = cronMinute(block),
        crontab = frequency === 'once'
          ? `${minutes} * * * *`
          : `${minutes%30}/30 * * * *`

      return [ crontab , 0 ]
    }
  }
}
