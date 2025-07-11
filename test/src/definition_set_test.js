import fs from "node:fs"
import { describe, it, beforeEach, afterEach } from 'node:test'
import { filter } from "lodash-es"
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

    it("has blocks, but not disabled blocks", function() {
      assert.isAbove(this.definitionSet.blocks.length, 1)
      assert.instanceOf(this.definitionSet.blocks[0], BlockDefinition)
      assert.isEmpty(filter(this.definitionSet.blocks, "disabled"))
    })

    it("has mixins, including inline mixins from blocks", function() {
      assert.isAbove(Object.keys(this.definitionSet.mixins).length, 1)
      assert.exists(this.definitionSet.mixins.weatherMixin, "Expected an inline mixin to be present")
    })

    it("has extensions, including inline extensions from blocks", function() {
      assert.isAbove(Object.keys(this.definitionSet.extensions).length, 1)
      assert.exists(this.definitionSet.extensions.validateNumbers, "Expected an inline extension to be present")
    })

    it("has mutators", function() {
      assert.isAbove(Object.keys(this.definitionSet.mutators).length, 1)
    })

    it("has generators", function() {
      assert.isAbove(Object.keys(this.definitionSet.generators).length, 1)
    })

    it("has regenerators", function() {
      assert.isAbove(Object.keys(this.definitionSet.regenerators).length, 1)
    })
  })

  describe("exporting blockly app", function() {
    beforeEach(function() {
      fs.mkdirSync("./tmp")
    })

    it("exports 4 files", async function() {
      const definitionSet = await DefinitionSet.load()
      await definitionSet.export({ to: "./tmp" })

      // blocks.json
      assert(fs.existsSync("./tmp/blocks.json"))
      assert.isAbove(fs.readFileSync("./tmp/blocks.json").length, 10)

      // toolbox.json
      assert(fs.existsSync("./tmp/toolbox.json"))
      assert.isAbove(fs.readFileSync("./tmp/toolbox.json").length, 10)

      // workspace.json
      assert(fs.existsSync("./tmp/workspace.json"))
      assert.isAbove(fs.readFileSync("./tmp/workspace.json").length, 10)

      // blockly_app.js
      assert(fs.existsSync("./tmp/blockly_app.js"))
      const jsContents = fs.readFileSync("./tmp/blockly_app.js").toString()
      // console.log(jsContents)
      assert.include(jsContents, "\n// Toolbox\n")
      assert.include(jsContents, "Variables: workspace => {")
      assert.include(jsContents, "\n// Mixins\n")
      assert.include(jsContents, "const allMixins = {")
      assert.include(jsContents, "\n// Extensions\n")
      assert.include(jsContents, "const allExtensions = {")
      assert.include(jsContents, "\n// Mutators\n")
      assert.include(jsContents, "const allBlockMutators = {")
      assert.include(jsContents, "\n// Generators\n")
      assert.include(jsContents, "const blockGenerators = {")
      assert.include(jsContents, "\n// Regenerators\n")
      assert.include(jsContents, "const blockRegenerators = {")
      assert.include(jsContents, "\n// Blockly API Wrapper\n")
    })

    afterEach(function() {
      fs.rmSync("./tmp", { recursive: true })
    })
  })
})
