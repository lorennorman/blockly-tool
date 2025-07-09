import { describe, it } from 'node:test'
import { assert } from 'chai'

import { processTemplate } from '#src/importer/block_processor/lines.js'


const TEMPLATE_FIXTURE = {
  template: `
    📧 Email |CENTER
    Subject: %SUBJECT
    Body: %BODY
  `,

  inputs: {
    SUBJECT: {
      description: "a template for generating the email subject",
      bytecodeProperty: "subjectTemplate",
    },

    BODY: {
      description: "a multi-line template for generating the email body",
      bytecodeProperty: "bodyTemplate",
    }
  },
}

describe("Block template processing", { only: true }, () => {
  it("works", () => {
    const templateProperties = processTemplate(TEMPLATE_FIXTURE)

    // console.log(templateProperties)

    assert.equal(templateProperties.message0, "📧 Email %1")
    assert.deepEqual(templateProperties.args0, [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      }
    ])
    assert.equal(templateProperties.message1, "Subject: %1")
    assert.deepEqual(templateProperties.args1, [
      {
        "type": "input_value",
        "name": "SUBJECT",
        "align": "RIGHT"
      }
    ])
    assert.equal(templateProperties.message2, "Body: %1")
    assert.deepEqual(templateProperties.args2, [
      {
        "type": "input_value",
        "name": "BODY",
        "align": "RIGHT"
      }
    ])
  })
})
