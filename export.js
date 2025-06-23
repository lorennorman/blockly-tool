import fs from 'fs'


// make a tiny DSL
const cleanDir = (dirName) => {
  if(fs.existsSync(dirName)) {
    fs.rmSync(dirName, { recursive: true, force: true })
  }
  fs.mkdirSync(dirName)
  console.log(`/${dirName}: clean`)
}

let totalBytesWritten = 0
const write = (filename, fileContents) => {
  const bytesToWrite = fileContents.length/1000

  fs.writeFileSync(filename, fileContents)

  console.log(`/${filename} (${bytesToWrite}k)`)
  totalBytesWritten += bytesToWrite
}

import DefinitionSet from '#src/definition_set.js'
import BlocklyJSExporter from '#src/blockly_js_exporter.js'


const startTime = Date.now()
console.log("Starting Blockly Export")
console.log("=======================")

// clear the export directory
cleanDir("export")

// load the definitions
const definitionSet = await DefinitionSet.load()

// pick a workspace to export
const workspace = definitionSet.workspaces[0]
write("export/workspace.json", workspace.toBlocklyJSONString())

// pick a toolbox to export
const toolbox = definitionSet.toolboxes[0]
write("export/toolbox.json", await toolbox.toBlocklyJSONString())

// select blocks from the workspace and toolbox
const blocks = definitionSet.getBlocksFrom(workspace, toolbox)
write("export/blocks.json", await blocks.toBlocklyJSON())

// export blockly_app.js
write("export/blockly.js", await BlocklyJSExporter.exportFor(workspace, toolbox, blocks))

const elapsed = Date.now() - startTime
console.log("=======================")
console.log(`🏁 Done. Wrote ${totalBytesWritten.toFixed(3)}k in ${elapsed}ms 🏁`)
