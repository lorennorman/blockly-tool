import Blockly from 'blockly'

/** Dynamic else-if and else support */
export default {
  elsePresent: false,
  elseIfCount: 0,

  saveExtraState: function() {
    return { elsePresent: this.elsePresent, elseIfCount: this.elseIfCount }
  },

  loadExtraState: function({ elsePresent, elseIfCount }) {
    this.setElseIfCount(elseIfCount)
    this.setElsePresent(elsePresent)
  },

  setElseIfCount: function(newElseIfCount) {
    const oldElseIfCount = this.elseIfCount

    const elseIfLabel = this.getInput('ELSE_IF_LABEL')
    elseIfLabel.removeField('PLUS_ELSE_IF', true)
    elseIfLabel.insertFieldAt(0, this.plusField(() => this.setElseIfCount(this.elseIfCount+1)), 'PLUS_ELSE_IF')

    while (this.elseIfCount < newElseIfCount) {
      this.addElseIf();
    }

    if (this.elseIfCount > newElseIfCount) {
      this.elseIfCount = newElseIfCount
    }

    if(oldElseIfCount !== newElseIfCount) {
      Blockly.Events.fire(new Blockly.Events.BlockChange(this, undefined, undefined,
        { elseIfCount: oldElseIfCount }, { elseIfCount: newElseIfCount }
      ))
    }
  },

  addElseIf: function() {
    const nextIndex = this.elseIfCount+1
    // create new numbered if/then inputs with a minus control
    this
      .appendValueInput(`IF${nextIndex}`)
      .appendField(this.minusField(() => this.removeElseIfAt(nextIndex)))
      .appendField(new Blockly.FieldLabel("else if"))
    this
      .appendStatementInput(`THEN${nextIndex}`)
      .appendField(new Blockly.FieldLabel("do"))

    // last 2-3 items should always be:
    // + else-if control
    // +/- else control
    // (optional) else input
    this.moveInputBefore('ELSE_IF_LABEL', null)
    this.moveInputBefore('ELSE_LABEL', null)
    if (this.getInput('ELSE')) {
      this.moveInputBefore('ELSE', null)
    }
    this.elseIfCount += 1
  },

  removeElseIfAt: function(targetIndex) {
    // detect my parent IF input and its THEN
    const
      ifName = `IF${targetIndex}`,
      thenName = `THEN${targetIndex}`,
      ifInput = this.getInput(ifName),
      thenInput = this.getInput(thenName)

    // sever the connections
    const ifConnection = ifInput.connection
    if(ifConnection.isConnected()) { ifConnection.disconnect() }
    const thenConnection = thenInput.connection
    if(thenConnection.isConnected()) { thenConnection.disconnect() }

    // shuffle remaining if/then connections down
    const
      inputs = this.inputList,
      nextIndex = inputs.indexOf(ifInput) + 2

    let i = nextIndex
    for (let input; (input = inputs[i]); i++) {
      if (input.name == 'ELSE_LABEL') { break }

      const { targetConnection } = input.connection || {}
      if (targetConnection) {
        inputs[i - 2].connection.connect(targetConnection)
      }
    }

    const indexToRemove = Math.floor((i-2)/2)
    this.removeInput(`IF${indexToRemove}`)
    this.removeInput(`THEN${indexToRemove}`)
    this.bumpNeighbours()

    this.elseIfCount -= 1
    Blockly.Events.fire(new Blockly.Events.BlockChange(this, undefined, undefined,
      { elseIfCount: this.elseIfCount+1 }, { elseIfCount: this.elseIfCount }
    ))
  },

  setElsePresent: function(newElsePresent) {
    const oldElsePresent = this.elsePresent
    this.elsePresent = newElsePresent

    this.elsePresent ? this.addElse() : this.removeElse()

    if(oldElsePresent !== newElsePresent) {
      // notify observers
      Blockly.Events.fire(new Blockly.Events.BlockChange(this, 'input', 'ELSE',
        { elsePresent: oldElsePresent }, { elsePresent: newElsePresent }
      ))
    }
  },

  addElse: function() {
    const elseLabel = this.getInput('ELSE_LABEL')

    // swap the plus to minus
    elseLabel.removeField('PLUS_ELSE', true)
    elseLabel.removeField('MINUS_ELSE', true)
    elseLabel.insertFieldAt(0, this.minusField(() => this.setElsePresent(false)), 'MINUS_ELSE')

    // add the input, write its label
    if(!this.getInput('ELSE')) {
      this
        .appendStatementInput('ELSE')
        .appendField(new Blockly.FieldLabel("do"))
    }
  },

  removeElse: function() {
    const elseLabel = this.getInput('ELSE_LABEL')
    // swap the minus to plus
    elseLabel.removeField('MINUS_ELSE', true)
    elseLabel.removeField('PLUS_ELSE', true)
    elseLabel.insertFieldAt(0, this.plusField(() => this.setElsePresent(true)), 'PLUS_ELSE')

    const elseInput = this.getInput('ELSE')

    // sever the connection
    if(elseInput) {
      const { connection } = elseInput
      if(connection.isConnected()) { connection.disconnect() }
      // remove the input
      this.removeInput('ELSE')
    }
  },

  plusImage:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
    '9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMT' +
    'ggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNz' +
    'FjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MW' +
    'MwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS' +
    '44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==',

  plusField: function(onClick) {
    return new Blockly.FieldImage(this.plusImage, 15, 15, undefined, onClick)
  },

  minusImage:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAw' +
    'MC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPS' +
    'JNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAw' +
    'IDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K',

  minusField: function(onClick) {
    return new Blockly.FieldImage(this.minusImage, 15, 15, undefined, onClick)
  },
}
