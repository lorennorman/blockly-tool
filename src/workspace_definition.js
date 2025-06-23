import fs from "node:fs"


class WorkspaceDefinition {
  /** @type String */
  definitionPath = null

  /** @type Object */
  definitionStatic = null

  static loadAll() {
    // look in app/workspace for *workspace*.json
    const workspaceDef = new WorkspaceDefinition()
    workspaceDef.definitionPath = "workspace/workspace"
    workspaceDef.definitionStatic = JSON.parse(fs.readFileSync(`${process.cwd()}/app/workspace/workspace.json`).toString())

    return [ workspaceDef ]
  }

  toBlocklyJSONString = function() {
    return JSON.stringify(this.definitionStatic, null, 2) + "\n"
  }
}

export default WorkspaceDefinition
