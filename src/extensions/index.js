import { compact, forEach, isArray, map } from 'lodash'
import Blockly from 'blockly'

import { allBlockDefinitions } from '/src/blocks/index.js'


let status = 'loading'
export const ready = () => { status = 'ready' }

export const injectData = (key, value) => {
  extensionData[key] = value
}

export default { ready, injectData }

const extensionData = {}

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

// pull in all the block-defined extensions and write them here
const blockExtensions = compact(map(allBlockDefinitions, "extensions"))
blockExtensions.forEach(extensions => {
  if(isArray(extensions)) { return } // just named, not defined in block

  forEach(extensions, (func, name) => { // defined inline, must register
    Blockly.Extensions.register(name, wrapExtension(func))
  })
})


// pull in all the globally defined extensions and write them here
// import populateFeedDropdown from './populate_feed_dropdown.js'
// const globalExtensions = { populateFeedDropdown }
const globalExtensions = {  }
forEach(globalExtensions, (func, name) => {
  Blockly.Extensions.register(name, wrapExtension(func))
})
