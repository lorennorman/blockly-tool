export default {
  type: "schedule_hourly",

  toolbox: {
    category: 'Schedules',
    label: "Fires once or twice on given hours, at a given minute."
  },

  visualization: {
    colour: 160,
    tooltip: [
      "Fires ONCE or TWICE, at MINUTE, every STEP hours, from START hour to END hour",
      "---------------",
      "Parameters:",
      "ONCE - fires at MINUTE.",
      "TWICE - fires at MINUTE, and at MINUTE +/- 30 minutes.",
      "MINUTE - minute-of-the-hour to fire",
      "STEP - fires every STEP hours. Default: 1, 'Every hour'. (Factors of 24 only)",
      "START - the first hour to run. Default: 0, 'Midnight'",
      "END - the last hour to run. Default: 23, '11pm'",
    ].join('\n')
  },

  connections: {
    mode: "value",
    output: "schedule"
  },

  lines: [
    [ "Hourly", "LEFT" ],

    [ "", {
      field: "FREQUENCY",
      options: [
        [ "Once", "once" ],
        [ "Twice", "twice" ],
      ]
    }],

    [ "...at:", {
      inputValue: 'MINUTE',
      check: 'cron_minute',
      shadow: 'selector_minute'
    }],

    [ "...every:", {
      inputValue: 'HOURS',
      check: 'cron_hours_range',
      shadow: 'selector_hours'
    }]
  ],

  generators: {
    json: (block, generator) => {
      const
        frequency = block.getFieldValue('FREQUENCY'),
        minutes = parseInt(generator.valueToCode(block, 'MINUTE', 0), 10),
        cronMinutes = frequency === 'once'
          ? minutes.toString()
          : `${minutes%30}/30`,
        // cronHours = JSON.parse(generator.valueToCode(block, 'HOURS', 0)),
        cronHours = generator.valueToCode(block, 'HOURS', 0),
        payload = {
          hourlySchedule: {
            frequency, cronMinutes, cronHours
          }
        }

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const { frequency, cronMinutes, cronHours } = blockObject.hourlySchedule

      return {
        type: "schedule_hourly",
        fields: {
          FREQUENCY: frequency
        },
        inputs: {
          // MINUTE: helpers.expressionToBlock(cronMinutes, { shadow: 'selector_minute' }),
          MINUTE: { block: { type: 'selector_minute', fields: { MINUTE: cronMinutes }}},
          HOURS: helpers.expressionToBlock(cronHours, { shadow: 'selector_hours' })
        }
      }
    }
  }
}
