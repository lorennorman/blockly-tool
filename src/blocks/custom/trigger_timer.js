export default {
  type: "trigger_timer",

  // where and how this block appears in the toolbox
  toolbox: {
    category: 'Triggers'
  },

  help: {
    tooltip: "",
    helpUrl: ""
  },

  visualization: {
    colour: 230
  },

  connections: {
    mode: "value",
    output: "trigger",
  },

  data: {
    fields: {
      RUN_AFTER: { options: [
        [ '10 sec', '10' ],
        [ '1 min', '60' ],
        [ '15 min', '900' ],
        [ '30 min', '1800' ],
        [ '1 hr', '3600' ],
        [ '6 hrs', '21600' ],
        [ '1 day', '86400' ]
      ]},
      EXTEND_TIMER: { checked: true }
    },

    inputValues: {
      FEED_A: {
        check: 'feed',
        shadow: 'selector_feed'
      },
      COMPARATOR: {
        check: 'comparison_operator',
        shadow: 'selector_comparison'
      },
      FEED_B: {
        check: [ "feed", "Number", "String" ],
        shadow: 'selector_feed'
      },
    },
  },

  lines: [
    { center: "⏲️ Timer" },
    { center: "Compare Feeds" },
    { right: {
        text: 'Feed:',
        input: 'FEED_A',
    }},
    { right: {
        text: "Compare Feeds",
        input: 'COMPARATOR',
    }},
    { right: {
        text: "Feed or Value:",
        input: 'FEED_B',
    }},
    { right: {
        text: "Run After:",
        input: 'RUN_AFTER',
    }},
    { right: {
        text: "Extend Timer?",
        input: 'EXTEND_TIMER',
    }}
  ],

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
