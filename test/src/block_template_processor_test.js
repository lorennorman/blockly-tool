import { describe, it } from 'node:test'
import { range, flatMap } from 'lodash-es'
import { assert } from 'chai'

import { processTemplate } from '#src/exporters/block_processor/lines.js'


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

describe("Block template processing", () => {
  it("works", () => {
    const templateProperties = processTemplate(TEMPLATE_FIXTURE)

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

  it("template to block examples", () => {
    const template = `
      %A %B %C %D
    `

    const givenPropsExpectLineCount = [
      [{ inputs: ["A", "B", "C", "D"]}, 4],
      [{ inputs: ["A", "B"], fields: ["C", "D"]}, 3],
      [{ inputs: [], fields: ["A", "B", "C", "D"]}, 1],
      [{ inputs: ["A"], fields: ["B", "C", "D"]}, 2],
      [{ inputs: ["D"], fields: ["A", "B", "C"]}, 1],
    ]

    givenPropsExpectLineCount.forEach(([given, expect]) => {
      const
        inputs = given.inputs.reduce((acc, keyName) => {
          acc[keyName] = {}
          return acc
        }, {}),
        fields = given.fields?.reduce((acc, keyName) => {
          acc[keyName] = { type: 'blah' }
          return acc
        }, {})

      assertNumberOfLines(processTemplate({
        template,
        inputs,
        fields
      }), expect)
    })
  })

  it("splits multiple inputs on 1 line into multiple messages/args", () => {
    const blockProps = processTemplate({
      template: `%A %B`,
      inputs: { A: {}, B: {} }
    })

    assertNumberOfLines(blockProps, 2)
  })

  it("adds a dummy input for lines with only fields", () => {
    const
      template = "%A",
      fields = { A: { type: 'any' } },
      blockProps = processTemplate({ template, fields })

    assert.equal(blockProps.message0, "%1 %2")
  })

  it("data prop detection", () => {
    const
      template = "(%A,%B)",
      inputs = { A: {}, B: {} },
      blockProps = processTemplate({ template, inputs })

    assert.equal(blockProps.message0, "(%1")
    assert.equal(blockProps.message1, ",%1")
    assert.equal(blockProps.message2, ") %1")
  })
})

const assertNumberOfLines = (blockProps, expectedLines) => {
  const keys = flatMap(range(expectedLines), index =>
    [ `message${index}`, `args${index}` ]
  )
  assert.hasAllKeys(blockProps, keys, `Expected block properties to have ${expectedLines} lines, had ${Object.keys(blockProps).length/2}`)
}
