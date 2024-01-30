export default {
  type: "trigger_timer",

  toolbox: {
    category: 'Triggers',
    label: "Fire a given period of time after activity passing a given condition on a given feed."
  },

  visualization: {
    colour: 120,
    tooltip: [
      "Fires when RUN_AFTER time has passed after activity on FEED that passes the COMPARISON with FEED_OR_VALUE.",
      "---------------",
      "Parameters:",
      "FEED - the feed to monitor for activity",
      "COMPARISON - the comparison operator to use. \"any\" fires on all data.",
      "FEED_OR_VALUE - the thing to compare with. Value: compared directly. Feed: compare with given feed's last value.",
      "RUN_AFTER - how long to wait after a qualifying update",
      "EXTEND_TIMER - whether to extend a pre-existing timer when new qualifying data comes in",
    ].join('\n')
  },

  connections: {
    mode: "value",
    output: "trigger",
  },

  lines: [
    [ "⏲️ Timer", "center" ], // alignment shorthand
    [ "Compare Feeds", "center" ],

    [ "Feed:", {
      inputValue: "FEED_A",
      check: "feed",
      shadow: 'selector_feed'
  }],

  [ "Operator:", {
      inputValue: "COMPARATOR",
      check: "comparison_operator",
      shadow: 'selector_comparison'
  }],

  [ "Feed or Value:", {
      inputValue: "FEED_B",
      check: [ "feed", "Number", "String" ],
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
