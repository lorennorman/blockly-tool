import { describe, it } from 'node:test'
import { assert } from 'chai'

import roundDef from "#app/blocks/math/round.js"
import BlockDefinition from "#src/definitions/block_definition.js"


describe("Round Block", { only: true }, () => {
  it("works", () => {
    const roundDefinition = BlockDefinition.parseRawDefinition(roundDef)

    assert.equal(roundDefinition.type, 'io_math_round')
  })
})
