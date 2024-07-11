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

import { importBlockJson } from './src/importer/block_importer.js'
import importToolboxJson from './src/importer/toolbox_importer.js'
import importWorkspaceJson from './src/importer/workspace_importer.js'

import importExtensionsJs from './src/importer/extension_importer.js'
import importMutatorsJs from './src/importer/mutator_importer.js'
import importGeneratorsJs from './src/importer/generator_importer.js'
import importRegeneratorsJs from './src/importer/regenerator_importer.js'


const
  processBlocks = async () => JSON.stringify(await importBlockJson(), null, 2),
  processToolbox = async () => JSON.stringify(await importToolboxJson(), null, 2),
  processWorkspace = async () => JSON.stringify(await importWorkspaceJson(), null, 2),
  processExtensions = () => importExtensionsJs(),
  processMutators = () => importMutatorsJs(),
  processGenerators = () => importGeneratorsJs(),
  processRegenerators = () => importRegeneratorsJs()

const startTime = Date.now()
console.log("Starting Blockly Export")
console.log("=======================")

withCleanDir("export", async write => {
  // JSON
  write("blocks.json", await processBlocks())
  write("toolbox.json", await processToolbox())
  write("workspace.json", await processWorkspace())

  // JS
  write("extensions.js", await processExtensions())
  write("mutators.js", await processMutators())
  write("generators.js", await processGenerators())
  write("regenerators.js", await processRegenerators())

  const elapsed = Date.now() - startTime
  console.log("=======================")
  console.log(`🏁 Done (${elapsed}ms) 🏁`)
})
