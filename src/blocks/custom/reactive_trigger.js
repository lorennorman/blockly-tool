
export default {
  toolbox: {
    category: 'Triggers'
  },

  json: {
    "type": "reactive_trigger",
    "implicitAlign0": "RIGHT",
    "message0": "Reactive Trigger %1 Compare Feeds: %2 Feed %3 Operator %4 Feed or Number %5 Limit Every %6 %7 %8 %9 Notify on Reset",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "FEED_A",
        "check": "feed",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "COMPARATOR",
        "check": "comparison_operator",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "FEED_B",
        "check": [
          "feed",
          "Number"
        ],
        "align": "RIGHT"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "NOTIFY_LIMIT",
        "options": [
          [
            "10 seconds",
            "10"
          ],
          [
            "1 day",
            "10000"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_checkbox",
        "name": "NOTIFY_ON_RESET",
        "checked": true
      }
    ],
    "inputsInline": false,
    "output": "trigger",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },

  generators: {
    json: (block, generator) => {
      const
        comparisonTargetType = block.getInputTargetBlock('FEED_B')?.type,
        comparisonTargetKey = (comparisonTargetType == 'feed_selector')
          ? 'to_feed_id'
          : 'value',
        comparisonTargetValue = generator.valueToCode(block, 'FEED_B', 0) || null,
        comparisonPayload = { [comparisonTargetKey]: comparisonTargetValue },

        payload = {
          trigger_type: 'reactive',
          feed_id: generator.valueToCode(block, 'FEED_A', 0) || null,
          operator: generator.valueToCode(block, 'COMPARATOR', 0) || null,
          notify_limit: block.getFieldValue('NOTIFY_LIMIT'),
          notify_on_reset: block.getFieldValue('NOTIFY_ON_RESET') === 'TRUE',
          ...comparisonPayload
        }

      return [ payload, 0 ]
    },

    markdown: (block, generator) => {
      return 'markity'
    }
  }
}
