import { invokeMap, range } from 'lodash-es'


export default {
  type: "delay_minutes",

  visualization: {
    colour: "0",
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [
    [ "%SECONDS minutes", {
      field: 'SECONDS',
      options: range(1, 60).map(seconds =>
        invokeMap([ seconds, seconds*60 ], "toString")
      )
      // options: [
      //   ['1', '60'],
      //   ['2', '120'],
      //   ...
      //   ['58', '3480'],
      //   ['59', '3540'],
      // ]
    }]
  ],

  generators: {
    json: () => {

    }
  }
}
