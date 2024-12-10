/* LOCAL->> */
const allBlockMutators = {}
/* <<-LOCAL */

for (const [blockName, mutatorObject] of Object.entries(allBlockMutators)) {
  Blockly.Extensions.registerMutator(blockName, mutatorObject, mutatorObject.helperFunction, mutatorObject.flyoutBlockTypes)
}
