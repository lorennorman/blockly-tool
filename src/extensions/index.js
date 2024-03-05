import Blockly from 'blockly'

/* LOCAL->> */
import { map } from 'lodash-es'
import { allBlockExtensions } from '../blocks/index.js'

// load file extensions from src/extensions/*.js
// import exampleExtension from './example_extension.js'
// const fileExtensions = { exampleExtension }
const fileExtensions = { }

const allExtensions = {
  ...allBlockExtensions,
  ...fileExtensions,
}

// replaces this entire block with this source
export const renderedExtensions = `
const allExtensions = {
  ${map(allExtensions, (func, key) => `${key}: ${func}`).join(',\n\n  ')}
}
`
/* <<-LOCAL */

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

// register all extnesions to Blockly, wrap them in a variable injector
for (const [extensionName, extensionFunc] of Object.entries(allExtensions)) {
  Blockly.Extensions.register(extensionName, wrapExtension(extensionFunc))
}
