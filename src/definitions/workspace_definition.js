class WorkspaceDefinition {
  /** @type String */
  definitionPath = null

  /** @type Object */
  definitionStatic = null

  toBlocklyJSON = function() {
    return this.definitionStatic
  }

  toBlocklyJSONString = function() {
    return JSON.stringify(this.definitionStatic, null, 2) + "\n"
  }
}

export default WorkspaceDefinition


WorkspaceDefinition.parseRawDefinition = function(definition, definitionSet) {
  const workspaceDef = new WorkspaceDefinition()
  workspaceDef.definitionStatic = definition

  return workspaceDef
}
