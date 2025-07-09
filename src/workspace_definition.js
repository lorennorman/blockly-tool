class WorkspaceDefinition {
  /** @type String */
  definitionPath = null

  /** @type Object */
  definitionStatic = null

  toBlocklyJSONString = function() {
    return JSON.stringify(this.definitionStatic, null, 2) + "\n"
  }
}

export default WorkspaceDefinition


WorkspaceDefinition.parseRawDefinition = function(definition, path, definitionSet) {
  const workspaceDef = new WorkspaceDefinition()
  workspaceDef.definitionPath = path
  workspaceDef.definitionStatic = definition

  return workspaceDef
}
