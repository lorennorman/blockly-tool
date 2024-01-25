
export default {
  type: "root_block",

  toolbox: { },

  visualization: {
    colour: 60,
    extensions: [ 'require_trigger_and_action' ],
    tooltip: [
      "Runs a given ACTION when a given TRIGGER fires.",
      "---------------",
      "Parameters:",
      "TRIGGER - says when to act. Choose one from the 'Triggers' category.",
      "ACTION - says what to do. Choose one from the 'Action' category."
    ].join('\n')
  },

  lines: [
    [ "Action Root", "CENTER" ],

    [ "Trigger:", {
      inputValue: "TRIGGER",
      check: "trigger",
    }],

    [ "Action:", {
      inputValue: "ACTION",
      check: "action",
    }],
  ],

  generators: {
    json: (block, generator) => {
      const
        trigger = generator.valueToCode(block, 'TRIGGER', 0),
        action = generator.valueToCode(block, 'ACTION', 0)

      return JSON.stringify({
        "trigger": {
          "id": null,
          "trigger_type_id": null,
          "status": "started",
          // trigger
          "feed_id": null,
          "operator": null,
          "value": null,
          "to_feed_id": null,
          "trigger_type": null,
          "notify_limit": null,
          "notify_on_reset": true,
          "timer_extend": null,
          "timer_wait": null,
          ...trigger,
          // action
          "action": null,
          "action_feed_id": null,
          "action_value": null,
          "subject_template": null,
          "body_template": null,
          "form_encoded": null,
          ...action
        }
      }, null, 2)
    }
  }
}







