// name the file extensionName.to_snake_case
// export an extensionName that identically matches the name blocks use
export const exampleExtensionName = ({ block, data, Blockly }) => {
  // injected params:
  // - block: the current block, `this` in regular Blockly extensions
  // - data: the data context shared with the parent application
  //         (this is where your redux data comes in or whatever)
  // - Blockly: imported blockly lib

  // do extension stuff here!
}

// also export as default
export default exampleExtensionName
