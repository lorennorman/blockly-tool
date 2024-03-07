export default ({ block, data, Blockly }) => {
  const
    // unpack blockly api
    { FieldImage, FieldLabel, Events: { fire, BlockChange }} = Blockly,

    // cache the label input, swaps between +/-
    elseLabel = block.getInput('ELSE_LABEL'),

    // plus/minus images
    plusImage =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
      '9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMT' +
      'ggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNz' +
      'FjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MW' +
      'MwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS' +
      '44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==',

    minusImage =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAw' +
      'MC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPS' +
      'JNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAw' +
      'IDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K',

    // plus/minus field generators
    plusField = () =>
      new FieldImage(plusImage, 15, 15, undefined, plusClicked),

    minusField = () =>
      new FieldImage(minusImage, 15, 15, undefined, minusClicked),

    // plus/minus click handlers
    minusClicked = () => {
      // swap the minus to plus
      elseLabel.removeField('MINUS_ELSE')
      elseLabel.insertFieldAt(0, plusField(), 'PLUS_ELSE')

      // sever the connection
      const elseConnection = block.getInput('ELSE').connection
      if(elseConnection.isConnected()) { elseConnection.disconnect() }
      // remove the input
      block.removeInput('ELSE')

      // notify observers
      fire(new BlockChange(block, 'input', 'ELSE',
        { elsePresent: true }, { elsePresent: false }
      ))
    },

    plusClicked = () => {
      // swap the plus to minus
      elseLabel.removeField('PLUS_ELSE')
      elseLabel.insertFieldAt(0, minusField(), 'MINUS_ELSE')

      // add the input, write its label
      // TODO: this should be the lines syntax
      block
        .appendStatementInput('ELSE')
        .appendField(new FieldLabel("do"))

      // notify observers
      fire(new BlockChange(block, 'input', 'ELSE',
        { elsePresent: false }, { elsePresent: true }
      ))
    }

  elseLabel.insertFieldAt(0, plusField(), 'PLUS_ELSE')
}
