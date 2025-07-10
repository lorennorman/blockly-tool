import { capitalize } from 'lodash-es'

import renderFields from './render_block_fields.js'
import renderInputs from './render_block_inputs.js'


const
  renderDescription = ({ description }) => description || "No docs for this block, yet.",

  renderWorkspace = definition => {
    const workspaceProps = JSON.stringify({
      toolbox: false,
      block: definition.type,
      blocks: definition.docBlocks || []
    })

    return `<BlocklyWorkspace v-bind='${ workspaceProps }' />`
  },

  renderOutput = definition => {
    return capitalize(definition.connections?.output || "Unspecified")
  },

  renderExamples = definition => {
    return "Coming soon..."
  }

export default definition =>
`---
title: "Block: ${definition.name}"
editLink: true
---

# Block: ${definition.name}

Type: \`${definition.type}\`

${ renderDescription(definition) }

## Workspace
${ renderWorkspace(definition) }

## Fields
${ renderFields(definition) }

## Inputs
${ renderInputs(definition) }

## Output
${ renderOutput(definition) }

## Examples
${ renderExamples(definition) }
`
