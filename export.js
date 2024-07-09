import fs from 'fs'

// export script helper function
const withCleanDir = async (dirName, writeFunction) => {
  if(fs.existsSync(dirName)) {
    fs.rmSync(dirName, { recursive: true, force: true })
  }
  fs.mkdirSync(dirName)
  console.log(`/${dirName}: clean`)

  let totalBytesWritten = 0
  const write = (filename, fileContents) => {
    const
      exportFilename = `${dirName}/${filename}`,
      bytesToWrite = fileContents.length

    fs.writeFileSync(exportFilename, fileContents)

    console.log(`/${exportFilename}: ${bytesToWrite} bytes`)
    totalBytesWritten += bytesToWrite
  }

  await writeFunction(write)

  console.log(`${totalBytesWritten} bytes written.`)
}

import blockJson from './src/importer/block_importer.js'
import toolbox from './src/importer/toolbox_importer.js'
import workspace from './src/importer/workspace_importer.js'

import processExtensions from './src/importer/extension_importer.js'
import processMutators from './src/importer/mutator_importer.js'
import processGenerators from './src/importer/generator_importer.js'
import processRegenerators from './src/importer/regenerator_importer.js'


const
  processBlocks = () => JSON.stringify(blockJson, null, 2),
  processToolbox = () => JSON.stringify(toolbox, null, 2),
  processWorkspace = () => JSON.stringify(workspace, null, 2)

const startTime = Date.now()
console.log("Starting Blockly Export")
console.log("=======================")

withCleanDir("export", write => {
  // JSON
  write("blocks.json", processBlocks())
  write("toolbox.json", processToolbox())
  write("workspace.json", processWorkspace())

  // JS
  write("extensions.js", processExtensions())
  write("mutators.js", processMutators())
  write("generators.js", processGenerators())
  write("regenerators.js", processRegenerators())

  const elapsed = Date.now() - startTime
  console.log("=======================")
  console.log(`🏁 Done (${elapsed}ms) 🏁`)
})
