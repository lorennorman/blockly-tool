
export default {
  toolbox: {
    category: 'Triggers'
  },

  json: {
    "type": "trigger_timer",
    "message0": "⏲️ Timer %1",
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
    "message4": "Feed or Value: %1",
    "args4": [
      {
        "type": "input_value",
        "name": "FEED_B",
        "check": [
          "feed",
          "Number",
          "String"
        ],
        "align": "RIGHT"
      }
    ],
    "message5": "Run After: %1 %2",
    "args5": [ {
        "type": "field_dropdown",
        "name": "RUN_AFTER",
        "options": [
          [ '10 sec', '10' ],
          [ '1 min', '60' ],
          [ '15 min', '900' ],
          [ '30 min', '1800' ],
          [ '1 hr', '3600' ],
          [ '6 hrs', '21600' ],
          [ '1 day', '86400' ]
        ]
      }, {
        "type": "input_dummy",
        "align": "RIGHT"
      }
    ],
    "message6": "Extend Timer? %1 %2",
    "args6": [
      {
        "type": "field_checkbox",
        "name": "EXTEND_TIMER",
        "checked": true
      }, {
        "type": "input_dummy",
        "align": "RIGHT"
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
          trigger_type: 'timer',
          feed_id: generator.valueToCode(block, 'FEED_A', 0) || null,
          operator: generator.valueToCode(block, 'COMPARATOR', 0) || null,
          timer_wait: block.getFieldValue('RUN_AFTER'),
          timer_extend: block.getFieldValue('EXTEND_TIMER') === 'TRUE',
          ...comparisonPayload
        }

      return [ payload, 0 ]
    }
  }
}
