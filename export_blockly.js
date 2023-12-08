import fs from 'fs'

import { allBlocksJson } from './src/blocks/index.js'
import toolbox from './src/toolbox.js'

if(fs.existsSync('export')) {
  fs.rmSync('export', { recursive: true, force: true })
}

fs.mkdirSync('export')

// workspace.xml
fs.copyFileSync('./src/workspace.xml', 'export/workspace.xml')

// blocks.json
fs.writeFileSync('export/blocks.json', JSON.stringify(allBlocksJson, null, 2))

// toolbox.json
fs.writeFileSync('export/toolbox.json', JSON.stringify(toolbox, null, 2))
