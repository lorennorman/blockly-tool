
export default {
  toolbox: {
    category: 'Triggers'
  },

  json: {
    "type": "trigger_reactive",
    "message0": "📥 Reactive Trigger %1",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message1": "Compare Feeds %1",
    "args1": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message2": "Feed: %1",
    "args2": [
      {
        "type": "input_value",
        "name": "FEED_A",
        "check": "feed",
        "align": "RIGHT"
      }
    ],
    "message3": "Operator: %1",
    "args3": [
      {
        "type": "input_value",
        "name": "COMPARATOR",
        "check": "comparison_operator",
        "align": "RIGHT"
      }
    ],
    "message4": "Feed: %1",
    "args4": [
      {
        "type": "input_value",
        "name": "FEED_B",
        "check": [
          "feed",
          "Number"
        ],
        "align": "RIGHT"
      }
    ],
    "message5": "Limit Every: %1",
    "args5": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message6": "%1 %2",
    "args6": [
      {
        "type": "field_dropdown",
        "name": "NOTIFY_LIMIT",
        "options": [
          [ 'Ten Seconds', '0' ],
          [ 'One Minute', '1' ],
          [ 'Fifteen Minutes', '15' ],
          [ 'Thirty Minutes', '30' ],
          [ 'One Hour', '60' ],
          [ 'Six Hours', '360' ],
          [ 'One Day', '1440' ]
        ]
      }, {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ],
    "message7": "Notify on Reset? %1",
    "args7": [
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

  inputs: {
    FEED_A: {
      shadow: {
        type: 'selector_feed'
      }
    },
    COMPARATOR: {
      shadow: {
        type: 'selector_comparison'
      }
    },
    FEED_B: {
      shadow: {
        type: 'selector_feed'
      }
    },
  },

  generators: {
    json: (block, generator) => {
      const
        comparisonTargetType = block.getInputTargetBlock('FEED_B')?.type,
        comparisonTargetKey = (comparisonTargetType == 'selector_feed')
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
