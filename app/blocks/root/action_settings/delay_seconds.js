import { makeOptions } from "#app/util/fields.js"


export default {
  type: "delay_seconds",

  visualization: {
    colour: "0",
    tooltip: "Set a delay between 1 and 59 seconds (or 0 for no delay)",
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [
    [ "%SECONDS seconds", {
      field: 'SECONDS',
      options: makeOptions({ from: 1, upTo: 60 })
      // options: [
      //   ['1', '1'],
      //   ...
      //   ['58', '58'],
      //   ['59', '59'],
      // ]
    }]
  ],

  generators: {
    json: () => {

    }
  }
}
