export default ({ block, data, Blockly }) => {
  const
    // unpack blockly api
    { FieldImage, FieldLabel, Events: { fire, BlockChange }} = Blockly,

    // cache the label input, swaps between +/-
    elseIfLabel = block.getInput('ELSE_IF_LABEL'),

    countIfThens = () => Math.floor((block.inputList.length-2)/2),

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

    minusField = targetIndex =>
      new FieldImage(minusImage, 15, 15, undefined, () => minusClicked(targetIndex)),

    // plus/minus click handlers
    minusClicked = targetIndex => {
      // detect my parent IF input and its THEN
      const
        ifName = `IF${targetIndex}`,
        thenName = `THEN${targetIndex}`,
        ifInput = block.getInput(ifName),
        thenInput = block.getInput(thenName)

      // sever the connections
      const ifConnection = ifInput.connection
      if(ifConnection.isConnected()) { ifConnection.disconnect() }
      const thenConnection = thenInput.connection
      if(thenConnection.isConnected()) { thenConnection.disconnect() }
      block.bumpNeighbours()

      // shuffle remaining if/then connections down
      const
        inputs = block.inputList,
        nextIndex = inputs.indexOf(ifInput) + 2

      for (let i = nextIndex, input; (input = inputs[i]); i++) {
        if (input.name == 'ELSE_LABEL') { break }

        const { targetConnection } = input.connection || {}
        if (targetConnection) {
          inputs[i - 2].connection.connect(targetConnection)
        }
      }

      // remove the last if/then pair
      const
        ifThenCount = countIfThens(),
        ifthenLastIndex = ifThenCount - 1
      block.removeInput(`IF${ifthenLastIndex}`)
      block.removeInput(`THEN${ifthenLastIndex}`)

      // notify observers
      fire(new BlockChange(block, undefined, undefined,
        { ifThenCount }, { ifThenCount: ifThenCount-1 }
      ))
    },

    plusClicked = () => {
      // detect next index
      const nextIndex = block.inputList.map(i => i.name).reduce(
        (acc, name) => name.startsWith("IF")
          ? Math.max(parseInt(name.slice(2), 10), acc)
          : acc,
        0
      ) + 1

      // create new numbered if/then inputs with a minus control
      block
        .appendValueInput(`IF${nextIndex}`)
        .appendField(minusField(nextIndex))
        .appendField(new FieldLabel("else if"))
      block
        .appendStatementInput(`THEN${nextIndex}`)
        .appendField(new FieldLabel("do"))

      // last 2-3 items should always be:
      // + else-if control
      // +/- else control
      // (optional) else input
      block.moveInputBefore('ELSE_IF_LABEL', null)
      block.moveInputBefore('ELSE_LABEL', null)
      if (block.getInput('ELSE')) {
        block.moveInputBefore('ELSE', null)
      }

      // notify observers
      const ifThenCount = countIfThens()
      fire(new BlockChange(block, undefined, undefined,
        { ifThenCount: ifThenCount-1 }, { ifThenCount }
      ))
    }

  elseIfLabel.insertFieldAt(0, plusField(), 'PLUS_ELSE_IF')
}
