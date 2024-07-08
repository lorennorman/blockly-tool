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

import importBlockJson from './src/importer/block_importer.js'
import toolbox from './src/importer/toolbox_importer.js'
import workspace from './src/importer/workspace_importer.js'

import importExtensions from './src/importer/extension_importer.js'
import importMutators from './src/importer/mutator_importer.js'
import importGenerators from './src/importer/generator_importer.js'
import importRegenerators from './src/importer/regenerator_importer.js'


const
  processBlocks = async () => JSON.stringify(await importBlockJson(), null, 2),
  processToolbox = () => JSON.stringify(toolbox, null, 2),
  processWorkspace = () => JSON.stringify(workspace, null, 2),
  processExtensions = async () => await importExtensions(),
  processMutators = async () => await importMutators(),
  processGenerators = async () => await importGenerators(),
  processRegenerators = async () => await importRegenerators()

const startTime = Date.now()
console.log("Starting Blockly Export")
console.log("=======================")

withCleanDir("export", async write => {
  // JSON
  write("blocks.json", await processBlocks())
  write("toolbox.json", processToolbox())
  write("workspace.json", processWorkspace())

  // JS
  write("extensions.js", await processExtensions())
  write("mutators.js", await processMutators())
  write("generators.js", await processGenerators())
  write("regenerators.js", await processRegenerators())

  const elapsed = Date.now() - startTime
  console.log("=======================")
  console.log(`🏁 Done (${elapsed}ms) 🏁`)
})
