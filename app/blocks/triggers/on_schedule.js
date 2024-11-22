import { map, range } from 'lodash-es'

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

  lines: [
    [ "On Schedule", "CENTER" ],

    [ "Months:", {
      inputValue: "MONTH",
      check: "cron_month",
      shadow: "every_month"
    }],

    [ "Days:", {
      inputValue: "DAY",
      check: "cron_day",
      shadow: "every_day"
    }],

    [ "Hours:", {
      inputValue: "HOUR",
      check: "cron_hour",
      shadow: "every_hour"
    }],

    [ "Minutes:", {
      inputValue: "MINUTE",
      check: "cron_minute",
      shadow: "every_minute"
    }],
  ],

  generators: {
    json: (block, generator) => {
      // build a cron string from each unit
      const
        minute = generator.valueToCode(block, 'MINUTE', 0) || "*/1",
        hour = generator.valueToCode(block, 'HOUR', 0) || "*/1",
        daysOfMonth = generator.valueToCode(block, 'DAY', 0) || "*/1",
        daysOfWeek = "*",
        month = generator.valueToCode(block, 'MONTH', 0) || "*/1"

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
        { schedule } = blockObject.onSchedule,
        [ minute, hour, daysOfMonth, month, daysOfWeek ] = schedule.split(' ')

      return {
        type: "on_schedule",
        inputs: {
          MONTH: helpers.expressionToBlock({ 'everyMonth': { frequency: month }}, { shadow: 'every_month' }),
          DAY: helpers.expressionToBlock({ 'everyDay': { frequency: daysOfMonth }}, { shadow: 'every_day' }),
          HOUR: helpers.expressionToBlock({ 'everyHour': { frequency: hour }}, { shadow: 'every_hour' }),
          MINUTE: helpers.expressionToBlock({ 'everyMinute': { frequency: minute }}, { shadow: 'every_minute' }),
        }
      }
    }
  }
}
