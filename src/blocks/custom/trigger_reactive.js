
export default {
  type: "trigger_reactive",

  toolbox: {
    category: 'Triggers',
    label: 'Fire when there is activity passing a given condition on a given feed.'
  },

  visualization: {
    "colour": 120,
    tooltip: [
      "Fires when there is activity on FEED that passes the COMPARISON with FEED_OR_VALUE and the NOTIFY_* settings.",
      "---------------",
      "Parameters:",
      "FEED - the feed to monitor for activity",
      "COMPARISON - the comparison operator to use. \"any\" fires on all data.",
      "FEED_OR_VALUE - the thing to compare with. If set to a feed, compares with that feed's last value.",
      "NOTIFY_LIMIT - sets a maximum frequency it will fire",
      "NOTIFY_ON_RESET - if set, the action will also fire (ignoring limits) when the condition becomes false",
    ].join('\n')
  },

  connections: {
    mode: "value",
    output: "trigger",
  },

  lines: [
    [ "📥 Reactive", "CENTER"],
    [ "Compare Feeds", "CENTER" ],

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

    [ "Limit Every:", {
        field: "NOTIFY_LIMIT",
        options: [
          [ '10 sec', '0' ],
          [ '1 min', '1' ],
          [ '15 min', '15' ],
          [ '30 min', '30' ],
          [ '1 hr', '60' ],
          [ '6 hrs', '360' ],
          [ '1 day', '1440' ]
        ]
    }],

    [ "Notify on Reset?", {
        field: "NOTIFY_ON_RESET",
        checked: true
    }],
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
          trigger_type: 'reactive',
          feed_id: generator.valueToCode(block, 'FEED_A', 0) || null,
          operator: generator.valueToCode(block, 'COMPARATOR', 0) || null,
          notify_limit: block.getFieldValue('NOTIFY_LIMIT'),
          notify_on_reset: block.getFieldValue('NOTIFY_ON_RESET') === 'TRUE',
          ...comparisonPayload
        }

      return [ payload, 0 ]
    }
  }
}
