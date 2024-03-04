// mode: "none" || "value" || "statement:first" || "statement:last" || "statement",
// output: "type" || ["list", "of", "types"],
// next: "type" || ["list", "of", "types"]
export default block => {
  const processEmpty = () => {
    if(output) {
      console.warn(`connections: "mode" is empty, no "output" expected, got: "${output}"`)
    }

    if(next) {
      console.warn(`connections: "mode" is empty, no "next" expected, got: "${next}"`)
    }
  }

  const processValue = () => {
    if(next) {
      console.warn(`connections: "mode" is "value", no "next" expected, got: "${next}"`)
    }

    return { output }
  }

  const processStatement = () => {
    const object = {}

    if(next && mode === 'statement:last') {
      console.warn(`connections: "mode" is "statement:last", no "next" expected, got: "${next}"`)
    }

    if(output && mode === 'statement:first') {
      console.warn(`connections: "mode" is "statement:first", no "output" expected, got: "${output}"`)
    }

    if(next && (mode === 'statement' || mode === 'statement:first')) {
      object.nextStatement = next
    }

    if(output &&(mode === 'statement' || mode === 'statement:last')) {
      object.previousStatement = output
    }

    return object
  }

  const { mode, output, next } = block.connections || {}

  switch(mode) {
    case null:
    case undefined:
    case 'none':
      return processEmpty()

    case 'value':
      return processValue()

    case 'statement:first':
    case 'statement':
    case 'statement:last':
      return processStatement()

    default:
      throw new Error(`Invalid value for connections.mode: "${mode}"`)
  }
}
