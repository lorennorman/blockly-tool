import BlockExporter from "./block_exporter.js"
import ToolboxExporter from "./toolbox_exporter.js"
import WorkspaceExporter from "./workspace_exporter.js"
import ScriptExporter from "./script_exporter.js"


/**
 *
 * @param {String} destination
 * @param {DefinitionSet} definitions
 * @param {Function} exportFunc
 */
export const exportTo = async (destination, definitions, exportFunc) => {
  // await definitions.export({ to: destination })

  const exporters = {
    toolbox: new ToolboxExporter(definitions, destination).exportToFile,
    workspace: new WorkspaceExporter(definitions, destination).exportToFile,
    blocks: new BlockExporter(definitions, destination).exportToFile,
    script: new ScriptExporter(definitions, destination).exportToFile,
  }

  exportFunc(exporters)
}
