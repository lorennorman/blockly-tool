import fs from 'fs'
import { map } from 'lodash-es'

import { customBlocksJson } from './src/blocks/index.js'
import allGenerators from './src/blocks/generators.js'
import toolbox from './src/toolboxes/index.js'

// export/
if(fs.existsSync('export')) { fs.rmSync('export', { recursive: true, force: true }) }
fs.mkdirSync('export')

// export/workspace.json
fs.copyFileSync('./src/workspaces/workspace.json', 'export/workspace.json')

// export/blocks.json
fs.writeFileSync('export/blocks.json', JSON.stringify(customBlocksJson, null, 2))

// export/toolbox.json
fs.writeFileSync('export/toolbox.json', JSON.stringify(toolbox, null, 2))

// export/generators.js
// writing an executable file is nasty business
//
// read in the file
const generatorsFile = fs.readFileSync('src/blocks/generators.js').toString()
// replace the import with an inlined collection of block definitions
const generators = 'const allBlockDefinitions = {\n' + map(allGenerators.json.forBlock, (func, block) => `  ${block}: { generators: { json: ${func} } }`).join(',\n\n') + '\n}\n'
const generatorOutput = generatorsFile.replace("import { allBlockDefinitions } from './index.js'", generators).replaceAll('\n    ', '\n  ')
// write the file back
fs.writeFileSync('export/generators.js', generatorOutput)
