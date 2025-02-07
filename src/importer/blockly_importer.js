import fs from 'fs'

import { importToolboxJs } from './toolbox_importer.js'
import importMixinsJs from './mixin_importer.js'
import importExtensionsJs from './extension_importer.js'
import importMutatorsJs from './mutator_importer.js'
import importGeneratorsJs from './generator_importer.js'
import importRegeneratorsJs from './regenerator_importer.js'


const section = (title, contents) => `
///////////
// ${title}
///////////
${contents}
`

export default async () => (
  [
    "import Blockly from 'blockly'\n\n",
    section("Toolbox", importToolboxJs()),
    section("Mixins", await importMixinsJs()),
    section("Extensions", await importExtensionsJs()),
    section("Mutators", await importMutatorsJs()),
    section("Generators", await importGeneratorsJs()),
    section("Regenerators", await importRegeneratorsJs()),
    section("Blockly API Wrapper", fs.readFileSync(`./src/importer/blockly_api.js`))
  ].join("")
)
