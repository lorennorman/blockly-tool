import { describe, it } from 'node:test'

import BlockDefinition from "#src/block_definition.js"


describe("Block Snapshots", async () => {
  // load all current blocks
  (await BlockDefinition.loadAll()).forEach(blockDefinition => {
    // define a test for each block
    it(`"${blockDefinition.name}" (${blockDefinition.type})`, ({ assert: { snapshot }}) => {
      // test merely checks the json representation
      snapshot(blockDefinition.toBlocklyJSON())
    })
  })
})
