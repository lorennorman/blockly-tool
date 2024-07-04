import fs from 'fs'


// export script helper function
const withCleanDir = (dirName, writeFunction) => {
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

  writeFunction(write)

  console.log(`${totalBytesWritten} bytes written.`)
}

// export helper for quick & dirty js template/inline replacement
const renderTemplate = (renderedContent, sourceFilename) => {
  // read in file contents
  const existingFileContent = fs.readFileSync(sourceFilename).toString()
  // return transformed contents
  return existingFileContent.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderedContent)
}


import { customBlocksJson } from './src/blocks/index.js'
import toolbox from './src/toolboxes/index.js'
import { renderedExtensions } from './src/extensions/index.js'
import { renderedMutators } from './src/mutators/index.js'
import { renderedBlockGenerators } from './src/blocks/generators.js'
import { renderRegenerators } from './src/blocks/regenerators.js'

const
  processBlocks = () => JSON.stringify(customBlocksJson, null, 2),
  processToolbox = () => JSON.stringify(toolbox, null, 2),
  processWorkspace = () => fs.readFileSync('src/workspaces/workspace.json').toString(),
  processExtensions = () => renderTemplate(renderedExtensions, "src/extensions/index.js"),
  processMutators = () => renderTemplate(renderedMutators, "src/mutators/index.js"),
  processGenerators = () => renderTemplate(renderedBlockGenerators, "src/blocks/generators.js"),
  processRegenerators = () => renderTemplate(renderRegenerators, "src/blocks/regenerators.js")

const startTime = Date.now()
console.log("Starting Blockly Export")
console.log("=======================")

withCleanDir("export", write => {
  // JSON
  write("blocks.json", processBlocks())
  write("toolbox.json", processToolbox())
  write("workspace.json", processWorkspace())

  // JS
  // write("plugins.js", processPlugins())
  // write("mixins.js", processMixins())
  // write("validators.js", processValidators())
  write("extensions.js", processExtensions())
  write("mutators.js", processMutators())
  write("generators.js", processGenerators())
  write("regenerators.js", processRegenerators())
})

const elapsed = Date.now() - startTime
console.log("=======================")
console.log(`🏁 Done (${elapsed}ms) 🏁`)
