import { describe, it } from 'node:test'
import { assert } from 'chai'

import { niceTemplate } from '#src/util.js'


describe("Nice Templates", () => {
  it("examples", () => {
    const givenTemplateExpectRender = [
      [ // drops empty leading/trailing line, trims leading whitespace
        `
          ABC
        `, "ABC"
      ],
      [ // keeps newlines in content
        `
          ABC
          DEF
        `, "ABC\nDEF"
      ],
      [ // keeps extra whitespace after first line
        `
          ABC
            DEF
        `, "ABC\n  DEF"
      ],
    ]

    givenTemplateExpectRender.forEach(([given, expect]) => {
      assert.equal(niceTemplate(given), expect,
        `Expected template \`${given}\` to produce output "${expect}"`
      )
    })
  })
})
