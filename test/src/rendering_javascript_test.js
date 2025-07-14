import { describe, it, beforeEach, afterEach } from 'node:test'
import { assert } from 'chai'

import renderObject from '#src/importer/object_renderer.js'


describe("Rendering JavaScript", () => {
  it("renders quoted/unquoted keys appropriately", () => {
    // abc should be unquoted
    // "hi jk" should be quoted
    const
      toRender = { abc: "def", "hi jk": 'lmnop' },
      rendered = renderObject(toRender),
      expected =
`{
  abc: "def",

  "hi jk": "lmnop"
}`

    assert.equal(rendered, expected)
  })
})
