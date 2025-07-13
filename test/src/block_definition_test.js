import { describe, it } from 'node:test'
import { assert } from 'chai'

import BlockDefinition from "#src/block_definition.js"


const BLOCK_FIXTURE = {
  type: 'test_block_fixture',
  name: 'Test Block',
  description: `
    Line 1
    Line 2
    Line 3
  `,
  inputsInline: true,
  color: 256,
}

const fixture = (options = {}) => {
  const newFixture = { ...BLOCK_FIXTURE }

  options.without?.forEach(property => {
    delete newFixture[property]
  })

  Object.keys(options.override || {}).forEach(property => {
    newFixture[property] = options.override[property]
  })

  return newFixture
}

describe("BlockDefinition", () => {
  describe("parseRawDefinition", () => {
    it("clean parse, properties available on instance", () => {
      // parses without issue
      const blockDefinition = BlockDefinition.parseRawDefinition(BLOCK_FIXTURE, 'path/to/block')
      // fields are available on the class instance
      assert.equal(blockDefinition.type, BLOCK_FIXTURE.type)
      assert.equal(blockDefinition.name, BLOCK_FIXTURE.name)
      assert.equal(blockDefinition.description, "Line 1\nLine 2\nLine 3")//BLOCK_FIXTURE.description)
      assert.equal(blockDefinition.definitionPath, 'path/to/block')
      assert.equal(blockDefinition.inputsInline, BLOCK_FIXTURE.inputsInline)
      assert.equal(blockDefinition.colour, BLOCK_FIXTURE.color)
    })

    it("requires a type", () => {
      assert.throws(() => {
        BlockDefinition.parseRawDefinition(fixture({ without: ['type']}))
      }, 'A unique `type` property is required')
    })

    describe("missing name", () => {
      // TODO: remove skip when warning returns
      it("warns", { skip: true }, ({ mock }) => {
        mock.method(console, 'warn')
        BlockDefinition.parseRawDefinition(fixture({ without: ['name'] }))
        assert.equal(console.warn.mock.callCount(), 1)
      })

      it("sets a default name from the type", () => {
        const
          noName = fixture({ without: ['name'] }),
          def = BlockDefinition.parseRawDefinition(noName)

        assert.equal(def.name, "Test Block Fixture")
      })

      it("removes leading io from default name", () => {
        const
          noNameIoType = fixture({ without: ['name'], override: { type: "io_test_block_fixture" }}),
          def = BlockDefinition.parseRawDefinition(noNameIoType)

        assert.equal(def.name, "Test Block Fixture")
      })
    })

    it("defaults inputsInline to false", () => {
      const
        noInputsInline = fixture({ without: ['inputsInline'] }),
        def = BlockDefinition.parseRawDefinition(noInputsInline)

      assert.equal(def.inputsInline, false)
    })

    it("looks up FieldDefinitions")
    it("looks up InputDefinitions")
    it("uses first line of description for tooltip")
  })

  describe("exporting", () => {
    it("toBlockly* returns a JSON object or string", () => {
      const blockDefinition = BlockDefinition.parseRawDefinition(BLOCK_FIXTURE, 'path/to/block')

      assert.instanceOf(blockDefinition.toBlocklyJSON(), Object)
      assert.typeOf(blockDefinition.toBlocklyJSONString(), 'string')
    })

    it("matches Blockly's JSON", () => {
      const blocklyObject = BlockDefinition.parseRawDefinition(BLOCK_FIXTURE, 'path/to/block').toBlocklyJSON()

      console.log(blocklyObject)
      assert.equal(blocklyObject.type, BLOCK_FIXTURE.type)
    })

    it("allToBlocklyJSON", () => {
      const
        definition = BlockDefinition.parseRawDefinition(BLOCK_FIXTURE, 'path/to/block'),
        blocklyObjects = BlockDefinition.allToBlocklyJSON([ definition, definition, definition ])

      assert.lengthOf(blocklyObjects, 3)
    })
  })
})
