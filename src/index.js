import * as Blockly from 'blockly'
import { allBlocksJson, allGenerators } from './blocks'
import toolbox from './toolbox'
import { save, load } from './serialization'

import './index.css'


// export block library json
Blockly.defineBlocksWithJsonArray(allBlocksJson)

// inject blockly with our toolbox
const blocklyDiv = document.getElementById('blocklyDiv')
const ws = Blockly.inject(blocklyDiv, {toolbox})

// TODO: inject workspace blocks

// prepare generators and their dom targets
const codeDiv = document.getElementById('generatedCode').firstChild
const outputDiv = document.getElementById('output')
const regenerate = () => {
  const json = allGenerators.json.workspaceToCode(ws)
  codeDiv.innerText = json

  const markdown = allGenerators.markdown.workspaceToCode(ws)
  outputDiv.innerText = markdown
}

// register listeners
// auto-save on non-UI changes
ws.addChangeListener((e) => e.isUiEvent || save(ws))

// auto-regenerate code
ws.addChangeListener((e) => {
  if(e.isUiEvent || // no UI events
     e.type == Blockly.Events.FINISHED_LOADING || // no on-load
     ws.isDragging()) // not while dragging
  { return }

  regenerate()
})

// load last sketch from storage
load(ws)
// run the generators
regenerate()
