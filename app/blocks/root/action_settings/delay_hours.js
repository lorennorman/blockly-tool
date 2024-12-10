import { makeOptions } from "#app/util/fields.js"


export default {
  type: "delay_hours",

  visualization: {
    colour: "0",
    tooltip: "Set a delay between 1 and 23 hours",
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [
    [ "%SECONDS hours", {
      field: 'SECONDS',
      options: makeOptions({ from: 1, upTo: 24, valueFunc: sec => sec*60*60 })
      // options: [
      //   ['1', '3600'],
      //   ['2', '7200'],
      //   ...
      //   ['58', '79200'],
      //   ['59', '82800'],
      // ]
    }]
  ],

  generators: {
    json: () => {

    }
  }
}
