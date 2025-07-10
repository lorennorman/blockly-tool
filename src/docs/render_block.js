import { capitalize } from 'lodash-es'

import renderFields from './render_block_fields.js'
import renderInputs from './render_block_inputs.js'


const
  renderDescription = definition => {
    const
      rawDescription = definition.visualization?.tooltip,
      description = rawDescription
        ? rawDescription.replaceAll("\n", "\n    ")
        : "No docs for this block, yet."

    return `    ${ description }`
  },

  renderWorkspace = definition => {
    return `<BlocklyWorkspace :toolbox="false" block="${ definition.type }" />`
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

## Description
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
