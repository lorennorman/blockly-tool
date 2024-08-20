/* LOCAL->> */
const allExtensions = {}
/* <<-LOCAL */

const extensions = (() => {
  let status = 'loading'
  const
    extensionData = {},

    ready = () => status = 'ready',

    injectDatum = (key, value) => extensionData[key] = value,

    injectData = dataObject => {
      for (const [key, value] of Object.entries(dataObject)) {
        extensions.injectDatum(key, value)
      }
    },

    dispose = () => {
      // delete all extension data keys
      for (const key in extensionData) {
        delete extensionData[key];
      }
      // remove ready status
      status = 'loading'
    }

  // helper to get late-bound data into blockly
  const wrapExtension = extensionFunc => {
    return function() {
      if(status !== 'ready') {
        throw new Error("Extension invoked before extensions.ready() was called.")
      }

      return extensionFunc({
        block: this,
        data: extensionData,
        Blockly
      })
    }
  }

  // register all extnesions to Blockly, wrap them in a variable injector
  for (const [extensionName, extensionFunc] of Object.entries(allExtensions)) {
    Blockly.Extensions.register(extensionName, wrapExtension(extensionFunc))
  }

  return { ready, injectDatum, injectData, dispose }
})()
