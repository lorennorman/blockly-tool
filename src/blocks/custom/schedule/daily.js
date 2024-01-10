import timeLines, { cronTime } from '../lines/time.js'


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

    ...timeLines
  ],

  generators: {
    json: block => {
      const
        timeCrontab = cronTime(block),
        crontab = `${timeCrontab} * * *`

      return [ crontab , 0 ]
    }
  }
}
