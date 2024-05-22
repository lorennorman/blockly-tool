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

// export/extensions.js
import { renderedExtensions } from './src/extensions/index.js'
// read
const extensionsFile = fs.readFileSync('src/extensions/index.js').toString()
// transform
const extensionOutput = extensionsFile.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderedExtensions)
// write
fs.writeFileSync('export/extensions.js', extensionOutput)

// export/mutators.js
import { renderedMutators } from './src/mutators/index.js'
// read
const mutatorsFile = fs.readFileSync('src/mutators/index.js').toString()
// transform
const mutatorOutput = mutatorsFile.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderedMutators)
// write
fs.writeFileSync('export/mutators.js', mutatorOutput)

// export/generators.js
import { renderedBlockGenerators } from './src/blocks/generators.js'
// read
const generatorsFile = fs.readFileSync('src/blocks/generators.js').toString()
// transform
const generatorOutput = generatorsFile.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderedBlockGenerators)
// write
fs.writeFileSync('export/generators.js', generatorOutput)

// export/regenerators.js
import { renderRegenerators } from './src/blocks/regenerators.js'
// read
const regeneratorsFile = fs.readFileSync('src/blocks/regenerators.js').toString()
// transform
const regeneratorOutput = regeneratorsFile.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderRegenerators())
// write
fs.writeFileSync('export/regenerators.js', regeneratorOutput)
