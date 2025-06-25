import { describe, it } from 'node:test'
import { assert } from 'chai'

import emailBlockDefObject from "#app/blocks/action/email.js"
import BlockDefinition from "#src/block_definition.js"


describe("Email Block", { only: true }, () => {
  it("works", ({ assert: { snapshot }}) => {
    const emailDefinition = BlockDefinition.parseDefinition(emailBlockDefObject)

    assert.equal(emailDefinition.type, 'action_email')
    snapshot(emailDefinition.toBlocklyJSON())
  })
})
