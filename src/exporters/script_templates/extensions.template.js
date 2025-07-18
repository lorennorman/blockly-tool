/* LOCAL->> */
const allExtensions = {}
/* <<-LOCAL */

const extensions = (() => {
  let status = 'loading'
  const
    extensionData = {},

    ready = () => status = 'ready',

    injectDatum = (key, value) => {
      extensionData[key] = value

      if(dataObservers[key]) {
        dataObservers[key].forEach(observer => {
          observer(value)
        })
      }
    },

    injectData = dataObject => {
      for (const [key, value] of Object.entries(dataObject)) {
        extensions.injectDatum(key, value)
      }
    },

    extendDatum = (key, value) => {
      injectDatum(key, {
        ...extensionData[key],
        ...value
      })
    },

    dataObservers = {},

    observeData = (key, observer) => {
      // register the observer to the key
      dataObservers[key] = dataObservers[key] || []
      dataObservers[key].push(observer)

      observer(extensionData[key])

      if(!extensionData[key]) {
        console.warn("Data observer registered for missing data key:", key)
      }

      // return a handy unobserve function
      // delayed so it can be called while observers are firing
      return () => setTimeout(() => unobserveData(key, observer), 1)
    },

    unobserveData = (key, observer) => {
      // locate the observer
      const observerIndex = dataObservers[key].indexOf(observer)

      // splice it out
      dataObservers[key].splice(observerIndex, 1) // at the observer's index, remove one element
    },

    dispose = () => {
      // delete all extension data keys
      for (const key in extensionData) {
        delete extensionData[key]
      }
      // remove all data observers
      for (const key in dataObservers) {
        delete dataObservers[key]
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

      return extensionFunc.call(this, {
        block: this,
        data: extensionData,
        observeData,
        Blockly
      })
    }
  }

  // register all extensions to Blockly, wrap them in a variable injector
  for (const [extensionName, extensionFunc] of Object.entries(allExtensions)) {
    Blockly.Extensions.register(extensionName, wrapExtension(extensionFunc))
  }

  return { ready, injectDatum, injectData, extendDatum, extensionData, dispose }
})()
