import { compact } from 'lodash-es'
import Blockly from 'blockly'


Blockly.Extensions.register('populate_feeds_dropdown', () => {})

Blockly.Extensions.register('require_trigger_and_action', function() {
  // Example validation upon block change:
  this.setOnChange(function(changeEvent) {
    const
      hasTrigger = !!this.getInput('TRIGGER').connection.targetBlock(),
      hasAction = !!this.getInput('ACTION').connection.targetBlock()

    if(hasTrigger && hasAction) {
      this.setWarningText(null)
      return
    }

    const warning = compact([
      'Must have:',
      !hasTrigger && '- a Trigger block to determine when to run.',
      !hasAction && '- an Action block to determine what to do.',
    ]).join('\n')

    this.setWarningText(warning)
  })
})
