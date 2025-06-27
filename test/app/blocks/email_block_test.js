import { describe, it } from 'node:test'
import { assert } from 'chai'

import emailBlockDefObject from "#app/blocks/action/email.js"
import BlockDefinition from "#src/block_definition.js"


describe("Email Block", () => {
  it("works", () => {
    const emailDefinition = BlockDefinition.parseDefinition(emailBlockDefObject)

    assert.equal(emailDefinition.type, 'action_email')
  })
})
