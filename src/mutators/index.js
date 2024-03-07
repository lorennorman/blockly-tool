import Blockly from 'blockly'

/* LOCAL->> */
import { allBlockMutators } from '../blocks/index.js'

console.log(allBlockMutators)

/* <<-LOCAL */


for (const [blockName, mutatorObject] of Object.entries(allBlockMutators)) {
  Blockly.Extensions.registerMutator(blockName, mutatorObject) //, opt_helperFn, opt_blockList);
}

export default {}
