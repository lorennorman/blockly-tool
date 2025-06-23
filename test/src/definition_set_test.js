import fs from "node:fs"
import { describe, it, beforeEach, afterEach } from 'node:test'
import { assert } from 'chai'

import DefinitionSet from "#src/definition_set.js"


describe("DefinitionSet", { only: true }, function() {
  describe("loading/importing definitions", function() {
    it("loads a definition set", function() {
      const defSet = DefinitionSet.load()
      assert.instanceOf(defSet, DefinitionSet)
    })
  })

  describe("workspaces, toolboxes, blocks", function() {
    beforeEach(function() { this.definitionSet = DefinitionSet.load() })

    it("has a workspace", function() {
      assert.lengthOf(this.definitionSet.workspaces, 1)
    })

    it("has a toolbox", function() {
      assert.lengthOf(this.definitionSet.toolboxes, 1)
    })

    it("has blocks", function() {
      assert.lengthOf(this.definitionSet.blocks, 35)
    })
  })

  describe("exporting blockly app", function() {
    beforeEach(function() {
      fs.mkdirSync("./tmp")
    })

    // it("ok to asplode", function() {
    //   throw new Error('asplode')
    // })

    it("makes a tmp dir", function() {
      assert(fs.existsSync("./tmp"))
    })

    // it("ok to asplode twice", function() {
    //   throw new Error('asplode twice')
    // })

    afterEach(function() {
      fs.rmdirSync("./tmp")
    })
  })
})
