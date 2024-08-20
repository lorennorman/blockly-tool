export default [
  { name: 'Logic', colour: 60 },
  { name: 'Math', colour: 120 },
  { name: 'Text', colour: 180 },
  { name: 'Variables', colour: 240, callback: workspace => {
    // called every time the category is opened

    // register a button callback by name
    // TODO: make a Button abstraction to wrap this up
    workspace.registerButtonCallback('new-variable', () => {
      const newVariableName = prompt("Enter a new Variable name:")
      workspace.createVariable(newVariableName)
    })

    // pull the existing variables out of the workspace
    const variableIds = workspace.getAllVariables().map(v => v.getId())

    // category contents
    const contents = [
      // button for creating new variables
      {
        kind: 'button',
        text: ' New... ',
        callbackKey: 'new-variable' // references the registered function above
      }, ...variableIds.flatMap(id => ([
        { // setter block for this variable
          kind: 'block',
          type: 'io_variables_set',
          fields: { VAR: { id }}
        }, { // getter block for this variable
          kind: 'block',
          type: 'io_variables_get',
          fields: { VAR: { id }}
        }
      ]))
    ]

    return contents
  }},
  { name: 'Feeds', colour: 300 },
  { name: 'Actions', colour: 360 },
]
