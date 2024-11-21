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
    assert.deepEqual(makeOptions({ upTo: 2 }), [["0", "0"], ["1", "1"]])
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
