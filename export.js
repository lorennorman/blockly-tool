import fs from 'fs'


// CLEAN
// export/
if(fs.existsSync('export')) { fs.rmSync('export', { recursive: true, force: true }) }
fs.mkdirSync('export')

// JSON FILES
// export/workspace.json
fs.copyFileSync('./src/workspaces/workspace.json', 'export/workspace.json')

// export/blocks.json
import { customBlocksJson } from './src/blocks/index.js'
fs.writeFileSync('export/blocks.json', JSON.stringify(customBlocksJson, null, 2))

// export/toolbox.json
import toolbox from './src/toolboxes/index.js'
fs.writeFileSync('export/toolbox.json', JSON.stringify(toolbox, null, 2))

// JS FILES
// quick/dirty js template/inline replacement

const renderTemplate = (renderedContent, sourceFilename, exportFilename) => {
  // read
  const existingFileContent = fs.readFileSync(`src/${sourceFilename}`).toString()
  // transform
  const newFileContent = existingFileContent.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderedContent)
  // write
  fs.writeFileSync(`export/${exportFilename}`, newFileContent)
}

import { renderedExtensions } from './src/extensions/index.js'
renderTemplate(renderedExtensions, "extensions/index.js", "extensions.js")

import { renderedMutators } from './src/mutators/index.js'
renderTemplate(renderedMutators, "mutators/index.js", "mutators.js")

import { renderedBlockGenerators } from './src/blocks/generators.js'
renderTemplate(renderedBlockGenerators, "blocks/generators.js", "generators.js")

import { renderRegenerators } from './src/blocks/regenerators.js'
renderTemplate(renderRegenerators, "blocks/regenerators.js", "regenerators.js")
