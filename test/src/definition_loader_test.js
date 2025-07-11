import { describe, it } from 'node:test'
import { assert } from 'chai'

import DefinitionLoader from "#src/definition_loader.js"


describe("DefinitionLoader", { only: true }, () => {
  describe("config")

  describe("locating files", () => {
    it("finds mutator definitions", async () => {
      const rawMutatorDefs = await DefinitionLoader.loadMutators()

      assert.lengthOf(Object.keys(rawMutatorDefs), 0)
    })

    it("finds mixin definitions", async () => {
      const rawMixinDefs = await DefinitionLoader.loadMixins()

      assert.lengthOf(Object.keys(rawMixinDefs), 1)
    })

    it("finds extension definitions", async () => {
      const rawExtensionDefs = await DefinitionLoader.loadExtensions()

      assert.isAbove(Object.keys(rawExtensionDefs).length, 1)
    })

    it("tracks block definitions and their paths", async () => {
      const rawBlockDefs = await DefinitionLoader.loadBlocks()
      // many blocks
      assert.isAbove(rawBlockDefs.length, 1)
      // path is a js file
      assert.match(rawBlockDefs[0].path, /\.js$/)
      // has a type property
      assert.hasAnyKeys(rawBlockDefs[0].definition, ['type'])
    })

    it("finds toolbox definitions", async () => {
      const rawToolboxDefs = await DefinitionLoader.loadToolboxes()
      // one toolbox
      assert.lengthOf(rawToolboxDefs, 1)
      // with 10 items
      assert.isAbove(rawToolboxDefs[0].length, 1)
    })

    it("finds workspace definitions", async () => {
      const rawWorkspaceDefs = await DefinitionLoader.loadWorkspaces()
      // one workspace
      assert.lengthOf(rawWorkspaceDefs, 1)
      // defines language version and list of blocks
      assert.equal(rawWorkspaceDefs[0].blocks.languageVersion, 0)
      assert.lengthOf(rawWorkspaceDefs[0].blocks.blocks, 1)
    })
  })

  describe("loading all files", () => {
    it("should have all resource types", async () => {
      const definitions = await DefinitionLoader.loadAll()

      assert.lengthOf(Object.keys(definitions.mutators), 0)
      assert.lengthOf(Object.keys(definitions.mixins), 1)
      assert.isAbove(Object.keys(definitions.extensions).length, 1)
      assert.isAbove(definitions.blocks.length, 1)
      assert.lengthOf(definitions.toolboxes, 1)
      assert.lengthOf(definitions.workspaces, 1)
    })
  })
})
