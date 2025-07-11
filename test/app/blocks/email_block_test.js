import { inspect } from 'node:util'
import { describe, it } from 'node:test'
import { assert } from 'chai'

import emailBlockDefObject from "#app/blocks/action/email.js"
import BlockDefinition from "#src/block_definition.js"


describe("Email Block", () => {
  it("works", () => {
    const emailDefinition = BlockDefinition.parseRawDefinition(emailBlockDefObject)

    assert.equal(emailDefinition.type, 'action_email')
  })

  it("exports block JSON", () => {
    const
      emailDefinition = BlockDefinition.parseRawDefinition(emailBlockDefObject),
      emailBlockJSON = emailDefinition.toBlocklyJSON()

    // contains messageX and argsX lines
    assert.exists(emailBlockJSON.message0)
    assert.exists(emailBlockJSON.args0)
    assert.exists(emailBlockJSON.message1)
    assert.exists(emailBlockJSON.args1)

    // doesn't contain input or field information
    assert.notExists(emailBlockJSON.inputs)
    assert.notExists(emailBlockJSON.fields)
  })

  it("exports instance JSON", () => {
    const
      emailDefinition = BlockDefinition.parseRawDefinition(emailBlockDefObject),
      emailInstanceJson = emailDefinition.toBlocklyInstanceJSON()

    // demonstrates deeply nested inputs and fields
    assert.exists(emailInstanceJson.inputs.SUBJECT.shadow.inputs.TEMPLATE.shadow.fields.TEXT)
    assert.exists(emailInstanceJson.inputs.BODY.shadow.inputs.TEMPLATE.shadow.fields.TEXT)
  })
})
