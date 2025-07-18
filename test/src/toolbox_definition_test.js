import { describe, it } from 'node:test'
import { assert } from 'chai'

import ToolboxDefinition from "#src/definitions/toolbox_definition.js"
import BlockDefinition from "#src/definitions/block_definition.js"


const RAW_DEFINITION = [
  {
    name: "Test Blocks",
    colour: 20,
    contents: [ 'test_block' ]
  }, {
    name: "Moar Blocks",
    colour: 200,
    contents: []
  }
]

const TEST_BLOCK_DEFINITION = BlockDefinition.parseRawDefinition({ type: 'test_block'})

describe("ToolboxDefinition", () => {
  describe("parsing a raw definition", () => {
    it("handles category names and colors", () => {
      const toolboxDefinition = ToolboxDefinition.parseRawDefinition(RAW_DEFINITION, { findBlock: () => { } })
      assert.equal(toolboxDefinition.categories[0].name, "Test Blocks")
      assert.equal(toolboxDefinition.categories[0].colour, 20)
      assert.equal(toolboxDefinition.categories[1].name, "Moar Blocks")
      assert.equal(toolboxDefinition.categories[1].colour, 200)
    })

    it("converts contents into blocks via DefinitionSet", () => {
      const
        // mock definition set that always returns this block
        definitionSet = { findBlock: () => TEST_BLOCK_DEFINITION },
        toolboxDefinition = ToolboxDefinition.parseRawDefinition(RAW_DEFINITION, definitionSet)

      assert.equal(toolboxDefinition.categories[0].contents[0], TEST_BLOCK_DEFINITION)
    })
  })

  describe("exporting toolbox json", () => {
    it('works', () => {
      const
        // mock definition set that always returns this block
        definitionSet = { findBlock: () => TEST_BLOCK_DEFINITION },
        toolboxDefinition = ToolboxDefinition.parseRawDefinition(RAW_DEFINITION, definitionSet)

      assert.deepEqual(toolboxDefinition.toBlocklyJSON(), {
        "kind": "categoryToolbox",
        "contents": [
          {
            "kind": "category",
            "name": "Test Blocks",
            "colour": 20,
            "contents": [
              {
                "kind": "block",
                "type": 'test_block',
              }
            ]
          },
          {
            "kind": "category",
            "name": "Moar Blocks",
            "colour": 200,
            "contents": []
          }
        ]
      })
    })
  })
})
