export default {
  type: "trigger_timer",

  toolbox: {
    category: 'Triggers'
  },

  visualization: {
    colour: 230
  },

  connections: {
    mode: "value",
    output: "trigger",
  },

  lines: [
    [ "⏲️ Timer", "center" ], // alignment shorthand
    [ "Compare Feeds", "center" ],

    [ 'Feed:', {
      inputValue: "FEED_A", // input value
      check: 'feed',
      shadow: 'selector_feed'
    }],

    [ "Compare Feeds:", {
      inputValue: "COMPARATOR",
      check: 'comparison_operator',
      shadow: {
        type: 'selector_comparison'
      }
    }],

    [ "Feed or Value:", {
      inputValue: "FEED_B",
      check: 'feed',
      shadow: 'selector_feed'
    }],

    [ "Run After:", {
      field: "RUN_AFTER", // field
      options: [
        [ '10 sec', '10' ],
        [ '1 min', '60' ],
        [ '15 min', '900' ],
        [ '30 min', '1800' ],
        [ '1 hr', '3600' ],
        [ '6 hrs', '21600' ],
        [ '1 day', '86400' ]
      ]
    }],

    [ "Extend Timer?", {
      field: "EXTEND_TIMER",
      checked: true
    }]
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

        // pair with api -> blockly diagram code in io-rails
        // imagine an expressive, generative middle layer...
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
