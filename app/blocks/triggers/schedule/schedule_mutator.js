/** Configure the schedule trigger block.
 *  User controls how they specify each time unit.
*/

export default {
  loadExtraState: function () { },

  saveExtraState: function () { },

  flyoutBlocks: [
    'all_months', 'one_month', 'some_months',
    'all_days',
    'all_hours',
    'all_minutes',
  ],

  unitConfigs: [
    // [ input name, default unit block type ]
    ["MONTH", "all_months"],
    ["DAY", "all_days"],
    ["HOUR", "all_hours"],
    ["MINUTE", "all_minutes"],
  ],

  decompose: function(workspace) {
    const scheduleSettings = workspace.newBlock('schedule_settings')
    scheduleSettings.initSvg()

    // walk outer block's inputs
    this.unitConfigs.forEach(([ inputName, defaultType]) => {
      const
        outerUnitType = this.getInputTargetBlock(inputName)?.type || defaultType,
        // create inner versions
        innerUnitInput = scheduleSettings.getInput(`${inputName}_BLOCK`),
        innerUnitConnection = innerUnitInput.connection,
        innerUnitBlock = workspace.newBlock(outerUnitType),
        { outputConnection } = innerUnitBlock

      innerUnitBlock.initSvg()
      // attach to schedule settings
      innerUnitConnection.connect(outputConnection)
    })

    return scheduleSettings
  },

  compose: function (settingsBlock) {
    // walk inner block's inputs
    this.unitConfigs.forEach(([ inputName ]) => {
      const
        outerMonthlyInput = this.getInput(inputName),
        outerMonthlyConnection = outerMonthlyInput.connection,
        innerMonthBlock = settingsBlock.getInputTargetBlock(`${inputName}_BLOCK`),
        innerMonthType = innerMonthBlock?.type,
        // create outer versions
        outerMonthBlock = this.workspace.newBlock(innerMonthType)

      // attach to this's inputs
      outerMonthlyConnection.targetBlock()?.dispose()
      outerMonthlyConnection.connect(outerMonthBlock.outputConnection)
      outerMonthBlock.initSvg()
      outerMonthBlock.render()
    })
  },
}
