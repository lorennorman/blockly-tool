const
  random = Math.random()*100000000, // busts the NodeJS file cache
  mutator = (await import(`./schedule/schedule_mutator.js?key=${random}`)).default

export default {
  type: "on_schedule",

  toolbox: {
    label: "Run this Action on a set schedule."
  },

  visualization: {
    colour: 30,
    tooltip: "A schedule to run the action, from every minute to once a year."
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  mutator,

  lines: [
    [ "On Schedule", "CENTER" ],

    [ "Months:", {
      inputValue: "MONTH",
      check: "cron_month",
      shadow: "all_months",
    }],

    [ "Days:", {
      inputValue: "DAY",
      check: "cron_day",
      shadow: "all_days"
    }],

    [ "Hours:", {
      inputValue: "HOUR",
      check: "cron_hour",
      shadow: "all_hours"
    }],

    [ "Minutes:", {
      inputValue: "MINUTE",
      check: "cron_minute",
      shadow: "all_minutes"
    }],
  ],

  generators: {
    json: (block, generator) => {
      // each schedule block generates a crontab for its unit
      const
        minute = generator.valueToCode(block, 'MINUTE', 0)  || "*/1",
        hour = generator.valueToCode(block, 'HOUR', 0)  || "*/1",
        daysOfMonth = generator.valueToCode(block, 'DAY', 0)  || "*/1",
        daysOfWeek = "*",
        month = generator.valueToCode(block, 'MONTH', 0)  || "*"

      return JSON.stringify({
        onSchedule: {
          schedule: `${minute} ${hour} ${daysOfMonth} ${month} ${daysOfWeek}`
        }
      })
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        monthCronToBlock = monthCron => {
          if(monthCron === '*') {
            return { block: { type: 'all_months' } }

          } else if(/^\d*$/gm.test(monthCron)) {
            return { block: { type: 'one_month', fields: { MONTH: monthCron } } }

          } else if(/^\w{3}(,\w{3})*$/gm.test(monthCron)) {
            const
              fieldNames = monthCron.toUpperCase().split(','),
              fields = fieldNames.reduce((acc, month) => {
                acc[month] = true
                return acc
              }, {})

            return { block: { type: 'some_months', fields }}

          } else {
            console.warn(`Bad crontab for months: ${monthCron}`)
          }
        },

        dayCronToBlock = dayCron => {
          if(dayCron === '*') {
            return { block: { type: 'all_days' } }
          } else {
            throw new Error(`Bad cron string for days: ${dayCron}`)
          }
        },

        hourCronToBlock = hourCron => {
          if(hourCron === '*') {
            return { block: { type: 'all_hours' } }
          } else {
            throw new Error(`Bad cron string for hours: ${hourCron}`)
          }
        },

        minuteCronToBlock = minuteCron => {
          if(minuteCron === '*') {
            return { block: { type: 'all_minutes' } }

          } else if(/^\d*$/gm.test(minuteCron)) {
            return { block: { type: 'one_minute', fields: { MINUTE: minuteCron } } }

          } else {
            throw new Error(`Bad cron string for minutes: ${minuteCron}`)
          }
        }

      const
        { schedule } = blockObject.onSchedule,
        [ minute, hour, daysOfMonth, month, daysOfWeek ] = schedule.split(' ')

      return {
        type: "on_schedule",
        inputs: {
          MONTH: monthCronToBlock(month),
          DAY: dayCronToBlock(daysOfMonth),
          HOUR: hourCronToBlock(hour),
          MINUTE: minuteCronToBlock(minute),
        }
      }
    }
  }
}
