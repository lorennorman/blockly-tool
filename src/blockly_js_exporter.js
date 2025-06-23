import importBlocklyJs from '#src/importer/blockly_importer.js'


export const BlocklyJSExporter = {
  exportFor: async (...blocklyDefinitions) => {
    return importBlocklyJs()
  }
}

export default BlocklyJSExporter
