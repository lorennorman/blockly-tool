import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { describe, it, beforeEach, afterEach } from 'node:test'
import { assert } from 'chai'

import DefinitionSet from "#src/definition_set.js"


const
  EXPORTS_DIR = `${import.meta.dirname}/export`,

  clearExportsDir = () => {
    if(existsSync(EXPORTS_DIR)) {
      rmSync(EXPORTS_DIR, { recursive: true })
    }

    mkdirSync(EXPORTS_DIR)
  },

  // load the fixture app once
  defSet = await DefinitionSet.load("test/src/integration/app_fixture")

defSet.exportDirectory = EXPORTS_DIR

// The new programmer says 'hello' to the world.
// The humble programmer waits.
// Time waits for no one.
//
// sentence:
// - noun
// - verb
// - predicate

describe("Exporting Blockly Files", () => {
  // ensure exports dir is cleared before and after each test
  beforeEach(clearExportsDir)
  afterEach(clearExportsDir) // comment to inspect a test's output

  describe("exporting Blocks", () => {
    it("export a block definition as a Blockly object", { only:true }, async () => {

      const sentenceObject = defSet.exportBlock("sentence", { toFile: false }) // default, returns the object
      assert.equal(sentenceObject.type, "sentence")

      const noReturn = defSet.exportBlock("sentence", { toFile: true }) // use default filename for block (sentence.json)
      assert.notExists(noReturn)
      assert(existsSync(`${EXPORTS_DIR}/sentence.json`))

      const stillNoReturn = defSet.exportBlock("sentence", { toFile: `my_block.json` }) // use given name
      assert.notExists(stillNoReturn)
      assert(existsSync(`${EXPORTS_DIR}/my_block.json`))
    })

    it("export all block definitions as Blockly objects", () => {
      const defSet = {}
      const query = { whatever: 'thing' }
      defSet.exportBlocks(query, { toFile: false }) // default, returns the object
      defSet.exportBlocks(query, { toFile: true }) // writes blocks.json
      defSet.exportBlocks(query, { toFile: "all_blocks.json" }) // writes all_blocks.json
    })

    // "trunk" refers to the base form of a block, with:
    // - fields defaulted
    // - unremovable shadows attached to inputs
    // - optional sub-blocks, as warranted
    it("export the special 'trunk' form of a block", () => {
      const defSet = {}
      defSet.exportBlockTrunk("sentence") // returns the trunk form of the sentence block
    })

    it("export other block trees by name", () => {
      const defSet = {}
      defSet.exportBlockTree("sentence", "simple") // exports the sentence block tree identified as "simple"
      defSet.exportBlockTree("sentence", "complex") // exports the sentence block tree identified as "complex"
      defSet.exportBlockTree("sentence", "trunk") // exports the trunk
    })
  })

  describe("exporting mixins")
  describe("exporting extensions")
  describe("exporting mutators")
  describe("exporting validations")
  describe("exporting generators")
  describe("exporting regenerators")
  describe("exporting all scripts: blockly_app.js")

  describe("exporting Toolboxes", () => {
    it("export a Toolbox category Blockly object", () => {
      const defSet = {}
      // the "Sentence Parts" category of the "main" toolbox
      defSet.exportToolboxCategory("main", "Sentence Parts")
    })

    it("export a Toolbox Blockly object", () => {
      const defSet = {}
      // the entire "main" toolbox
      defSet.exportToolbox("main", { toFile: false }) // default, returns the toolbox object
      defSet.exportToolbox("main", { toFile: true }) // exports the main toolbox object to toolbox.json
      defSet.exportToolbox("main", { toFile: "other_toolbox.json" }) // exports the main toolbox object to other_toolbox.json
    })
  })

  describe("exporting a Workspaces", () => {
    it("export a Workspace Blockly object", () => {
      const defSet = {}
      // the entire "main" workspace
      defSet.exportWorkspace("main", { toFile: false }) // default, returns the workspace object
      defSet.exportWorkspace("main", { toFile: true }) // writes the workspace to workspace.json
      defSet.exportWorkspace("main", { toFile: "other_workspace.json" }) // writes the workspace to other_workspace.json
    })
  })

  describe("exporting a standalone Blockly app", () => {
    it("exports all 4 files correctly", () => {
      const defSet = {}
      const config = {}
      // config can specify export locations, bundling stuff, etc
      defSet.exportApp("io-actions", config) // export the app named "io-actions" to standalone files
      // exports files:
      // - blocks.json
      // - toolbox.json
      // - workspace.json
      // - blockly_app.js
    })
  })

  describe("exporting a documentation site for a Blockly app", () => {
    it("exports tiny Blockly apps for each block definition", () => {
      const defSet = {}
      const config = {}
      // config can specify export locations, bundling stuff, etc
      defSet.exportDocs("io-actions", config) // export the documentation site for the app named "io-actions" to standalone files
      // exports:
      // - .md files for each block
      // - static .md files already present
      // - smaller collaborator-block bundles for
      // - blockly_app.js
    })
  })
})
