// Mutators

/* LOCAL->> */
const allBlockMutators = {}
/* <<-LOCAL */

for (const [blockName, mutatorObject] of Object.entries(allBlockMutators)) {
  if(mutatorObject.helperFunction) {
    Blockly.Extensions.registerMutator(blockName, mutatorObject, mutatorObject.helperFunction)
  } else {
    Blockly.Extensions.registerMutator(blockName, mutatorObject)
  }
}
