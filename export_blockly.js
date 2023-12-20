import fs from 'fs'
import { map } from 'lodash-es'

import { customBlocksJson, allGenerators } from './src/blocks/index.js'
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
const generatorsFile = fs.readFileSync('src/blocks/generators.js').toString()
const generators = 'const allBlocks = {\n' + map(allGenerators.json.forBlock, (func, block) => `  ${block}: { generators: { json: ${func} } }`).join(',\n\n') + '\n}\n'
const generatorOutput = generatorsFile.replace("import allBlocks from './all.js'", generators).replaceAll('\n    ', '\n  ')
fs.writeFileSync('export/generators.js', generatorOutput)
