/* LOCAL->> */
const allMixins = {}
/* <<-LOCAL */

for (const [mixinName, mixinObject] of Object.entries(allMixins)) {
  Blockly.Extensions.registerMixin(mixinName, mixinObject)
}
