const MUTATOR_BASE = {
  loadExtraState: function () { },

  saveExtraState: function () { },

  flyoutBlocks: [],

  decompose: function (workspace) {
    // prepare the mutator root block as usual in decompose
    const settingsBlock = workspace.newBlock(this.rootBlock) // here
    settingsBlock.initSvg()

    const
      inputName = this.outerInputName, // here
      defaultType = this.defaultType, // here
      outerUnitType = this.type || defaultType,
      // create inner versions
      innerUnitInput = settingsBlock.getInput(this.innerInputName), // here
      innerUnitConnection = innerUnitInput.connection,
      innerUnitBlock = workspace.newBlock(outerUnitType),
      { outputConnection } = innerUnitBlock

    // copy fields from outer block to inner block
    this.copyFields(this, innerUnitBlock)

    // initialize the block for interaction
    innerUnitBlock.initSvg()
    // attach to schedule settings
    innerUnitConnection.connect(outputConnection)

    // remove mutators from all the inner blocks
    const innerBlocks = workspace.getFlyout().getWorkspace().getTopBlocks() || []
    innerBlocks.forEach(block => block.setMutator(null))

    // self-removing listener callback, applied to the outer workspace,
    // that calls attachOuterBlock when the mutator is closed
    const bubbleCloseCallback = e => {
      if(e.type !== Blockly.Events.BUBBLE_OPEN) { return }

      if(!e.isOpen) {
        this.attachOuterBlock(settingsBlock)
        this.workspace.removeChangeListener(bubbleCloseCallback)
      }
    }
    this.workspace.addChangeListener(bubbleCloseCallback)

    // when a new block is created in this mutator, remove mutators from those blocks too
    workspace.addChangeListener(e => {
      if(e.type !== Blockly.Events.BLOCK_CREATE) { return }
      if(e.blockId === settingsBlock.id) { return }

      const block = workspace.getBlockById(e.blockId)

      block?.setMutator(null)
    })

    return settingsBlock
  },

  // compose gets called frequently, despite what the docs say
  // as a result it needs to store the changes it wants to make
  // for later processing, instead of just doing them
  compose: function (settingsBlock) {
    const newBlock = settingsBlock.getInputTargetBlock(this.innerInputName) // here

    if(newBlock) {
      this.newBlockType = newBlock.type
      this.storeFieldData(newBlock)
    } else {
      this.newBlockType = null
      this.fieldData = {}
    }
  },

  // replace ourself with the new block and its data
  attachOuterBlock: function(settingsBlock) {
    const
      outerUnitConnection = this.outputConnection.targetConnection,
      outerUnitBlock = this.workspace.newBlock(this.newBlockType)

    // populate new block with data stored from the inner block
    this.restoreFieldData(outerUnitBlock)

    // disconnect ourself
    outerUnitConnection.disconnect()
    // connect our new block and intialize its graphics
    outerUnitConnection.connect(outerUnitBlock.outputConnection)
    outerUnitBlock.initSvg()
    outerUnitBlock.render()

    // be done with ourself
    this.dispose()
  },

  // field data helpers
  getFieldNames: function(block) {
    return block.inputList.reduce((names, input) =>
      names.concat(input.fieldRow.map(field => field.name).filter(name => name))
    , [])
  },

  copyFields: function(fromBlock, toBlock) {
    const fieldNames = this.getFieldNames(fromBlock)

    // get from source, set on destination
    fieldNames.forEach(fieldName => {
      toBlock.setFieldValue(fromBlock.getFieldValue(fieldName), fieldName)
    })
  },

  storeFieldData: function(fromBlock) {
    const fieldNames = this.getFieldNames(fromBlock)

    this.fieldData = fieldNames.reduce((data, name) => {
      data[name] = fromBlock.getFieldValue(name)
      return data
    }, {})
  },

  restoreFieldData: function(toBlock) {
    for (const [fieldName, fieldValue] of Object.entries(this.fieldData)) {
      toBlock.setFieldValue(fieldValue, fieldName)
    }
  }
}

export default (flyoutBlocks, rootBlock, defaultType, outerInputName, innerInputName) => {
  return {
    ...MUTATOR_BASE,
    flyoutBlocks, rootBlock, defaultType, outerInputName, innerInputName
  }
}
