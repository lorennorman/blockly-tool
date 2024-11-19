import { invokeMap, range } from 'lodash-es'


export default {
  type: "delay_hours",

  visualization: {
    colour: "0",
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [
    [ "%SECONDS hours", {
      field: 'SECONDS',
      options: range(1, 24).map(seconds =>
        invokeMap([ seconds, seconds*60*60 ], "toString")
      )
      // options: [
      //   ['1', '3600'],
      //   ['2', '3660'],
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
