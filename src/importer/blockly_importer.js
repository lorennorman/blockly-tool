import importExtensionsJs from './extension_importer.js'
import importMutatorsJs from './mutator_importer.js'
import importGeneratorsJs from './generator_importer.js'
import importRegeneratorsJs from './regenerator_importer.js'


export default async () => (
  [
    "import Blockly from 'blockly'",
    await importExtensionsJs(),
    await importMutatorsJs(),
    await importGeneratorsJs(),
    await importRegeneratorsJs(),
  ].join("\n//----------\n\n")
)
