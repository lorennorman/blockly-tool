/** Configure the schedule trigger block.
 *  User controls how they specify each time unit.
*/

export default {
  loadExtraState: function () { },

  saveExtraState: function () { },

  flyoutBlocks: [ 'all_months', 'one_month' ],

  decompose: function(workspace) {
    const scheduleSettings = workspace.newBlock('schedule_settings')
    scheduleSettings.initSvg()

    // walk outer block's inputs
    // create inner versions
    // attach to schedule settings
    const
      outerMonthlyType = this.getInputTargetBlock("MONTH")?.type || 'all_months',
      innerMonthlyInput = scheduleSettings.getInput("MONTH_BLOCK"),
      innerMonthlyConnection = innerMonthlyInput.connection,
      innerMonthlyBlock = workspace.newBlock(outerMonthlyType),
      { outputConnection } = innerMonthlyBlock

    innerMonthlyBlock.initSvg()
    innerMonthlyConnection.connect(outputConnection)

    return scheduleSettings
  },

  compose: function (settingsBlock) {
    // walk inner block's inputs
    // create outer versions
    // attach to this's inputs
    const
      outerMonthlyInput = this.getInput("MONTH"),
      outerMonthlyConnection = outerMonthlyInput.connection,
      innerMonthBlock = settingsBlock.getInputTargetBlock("MONTH_BLOCK"),
      innerMonthType = innerMonthBlock?.type,
      outerMonthBlock = this.workspace.newBlock(innerMonthType)

    outerMonthlyConnection.targetBlock()?.dispose()
    outerMonthlyConnection.connect(outerMonthBlock.outputConnection)
    outerMonthBlock.initSvg()
    outerMonthBlock.render()
  },
}
