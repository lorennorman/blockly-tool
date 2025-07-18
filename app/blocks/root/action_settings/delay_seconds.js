import { makeOptions } from "#app/util/fields.js"


export default {
  type: "delay_seconds",
  name: "Delay Seconds",
  colour: "0",
  description: "Set a delay between 1 and 59 seconds (or 0 for no delay)",

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  template: "%SECONDS seconds",

  fields: {
    SECONDS: {
      options: makeOptions({ from: 1, upTo: 60 })
      // options: [
      //   ['1', '1'],
      //   ...
      //   ['58', '58'],
      //   ['59', '59'],
      // ]
    }
  },

  generators: {
    json: () => {

    }
  }
}
