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
    'all_minutes', 'one_minute',
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
        outerUnitBlock = this.getInputTargetBlock(inputName),
        outerUnitType = outerUnitBlock?.type || defaultType,
        // create inner versions
        innerUnitInput = scheduleSettings.getInput(`${inputName}_BLOCK`),
        innerUnitConnection = innerUnitInput.connection,
        innerUnitBlock = workspace.newBlock(outerUnitType),
        { outputConnection } = innerUnitBlock

      // copy fields from outer block to inner block
      this.copyFields(outerUnitBlock, innerUnitBlock)

      // initialize the block for interaction
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
        outerUnitInput = this.getInput(inputName),
        outerUnitConnection = outerUnitInput.connection,
        innerUnitBlock = settingsBlock.getInputTargetBlock(`${inputName}_BLOCK`),
        innerUnitType = innerUnitBlock?.type,
        // create outer versions
        outerUnitBlock = this.workspace.newBlock(innerUnitType)

      // copy inner block fields to outer block fields
      this.copyFields(innerUnitBlock, outerUnitBlock)

      // attach to this's inputs
      outerUnitConnection.targetBlock()?.dispose()
      outerUnitConnection.connect(outerUnitBlock.outputConnection)
      outerUnitBlock.initSvg()
      outerUnitBlock.render()
    })
  },

  copyFields: function(fromBlock, toBlock) {
    // block -> inputList -> fieldRow -> name
    const fieldNames = fromBlock.inputList.reduce((names, input) =>
      names.concat(input.fieldRow.map(field => field.name).filter(name => name))
    , [])

    // get from source, set on destination
    fieldNames.forEach(fieldName => {
      toBlock.setFieldValue(fromBlock.getFieldValue(fieldName), fieldName)
    })
  }
}
