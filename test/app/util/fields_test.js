import { describe, it } from 'node:test'
import { assert } from 'chai'

import { makeOptions } from "#app/util/fields.js"


describe("Fields utils", () => {
  describe("makeOptions", () => {
    it("blows up with no valid options", () => {
      assert.throws(() => makeOptions())
    })
  })

  describe("makeOptions.upTo", () => {
    it("uses from: 0 and step: 1 if options not given", () => {
      assert.deepEqual(makeOptions({ upTo: 2 }), [["0", "0"], ["1", "1"]])
    })

    it("uses 'from' option if given", () => {
      assert.deepEqual(makeOptions({ from: 1, upTo: 2 }), [["1", "1"]])
    })

    it("uses 'step' option if given", () => {
      assert.deepEqual(makeOptions({ upTo: 21, step: 10 }), [
        ["0", "0"], ["10", "10"], ["20", "20"]
      ])
    })

    it("uses 'valueFunc' option if given", () => {
      assert.deepEqual(makeOptions({ upTo: 3, valueFunc: (v) => v*5 }),
        [["0", "0"], ["1", "5"], ["2", "10"]]
      )
    })
  })

  describe("makeOptions.factorsOf", () => {
    it("makes options with factors", () => {
      assert.deepEqual(makeOptions({ factorsOf: 2 }), [["1", "1"]])
      assert.deepEqual(makeOptions({ factorsOf: 24 }),
        [
          [ '1', '1' ], [ '2', '2' ], [ '3', '3' ],
          [ '4', '4' ], [ '6', '6' ], [ '8', '8' ],
          [ '12', '12' ]
        ]
      )
      assert.deepEqual(makeOptions({ factorsOf: 60 }),
        [
          [ '1', '1' ],   [ '2', '2' ], [ '3', '3' ],
          [ '4', '4' ], [ '5', '5' ],   [ '6', '6' ],
          [ '10', '10' ], [ '12', '12' ], [ '15', '15' ],
          [ '20', '20' ], [ '30', '30' ]
        ]
      )
    })
  })
})
