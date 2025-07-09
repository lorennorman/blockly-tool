import fs from "node:fs"
import { describe, it, beforeEach, afterEach } from 'node:test'
import { assert } from 'chai'

import DefinitionSet from "#src/definition_set.js"
import WorkspaceDefinition from "#src/workspace_definition.js"
import ToolboxDefinition from "#src/toolbox_definition.js"
import BlockDefinition from "#src/block_definition.js"


describe("DefinitionSet", function() {
  describe("loading/importing definitions", function() {
    it("loads a definition set", async function() {
      const defSet = await DefinitionSet.load()
      assert.instanceOf(defSet, DefinitionSet)
    })
  })

  describe("workspaces, toolboxes, blocks", function() {
    beforeEach(async function() { this.definitionSet = await DefinitionSet.load() })

    it("has a workspace", function() {
      assert.lengthOf(this.definitionSet.workspaces, 1)
      assert.instanceOf(this.definitionSet.workspaces[0], WorkspaceDefinition)
    })

    it("has a toolbox", function() {
      assert.lengthOf(this.definitionSet.toolboxes, 1)
      assert.instanceOf(this.definitionSet.toolboxes[0], ToolboxDefinition)
    })

    it("has blocks", function() {
      assert.isAbove(this.definitionSet.blocks.length, 1)
      assert.instanceOf(this.definitionSet.blocks[0], BlockDefinition)
    })
  })

  describe("exporting blockly app", function() {
    beforeEach(function() {
      fs.mkdirSync("./tmp")
    })

    it("exports 4 files", { only: true }, async function() {
      const definitionSet = await DefinitionSet.load()
      await definitionSet.export({ to: "./tmp" })

      assert(fs.existsSync("./tmp/blocks.json"))
      assert.isAbove(fs.readFileSync("./tmp/blocks.json").length, 10)
      assert(fs.existsSync("./tmp/toolbox.json"))
      assert.isAbove(fs.readFileSync("./tmp/toolbox.json").length, 10)
      assert(fs.existsSync("./tmp/workspace.json"))
      assert.isAbove(fs.readFileSync("./tmp/workspace.json").length, 10)
      assert(fs.existsSync("./tmp/blockly_app.js"))
      assert.isAbove(fs.readFileSync("./tmp/blockly_app.js").length, 100)

      // console.log(fs.readFileSync("./tmp/blockly_app.js").toString())
    })

    afterEach(function() {
      fs.rmSync("./tmp", { recursive: true })
    })
  })
})
