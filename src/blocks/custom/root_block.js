
export default {
  toolbox: { },

  json: {
    "type": "root_block",
    "message0": "Action Root %1 Trigger: %2 Action: %3",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "TRIGGER",
        "check": "trigger",
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "ACTION",
        "check": "action",
        "align": "RIGHT"
      }
    ],
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },

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







