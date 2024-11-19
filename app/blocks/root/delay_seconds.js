import { invokeMap, range } from 'lodash-es'


export default {
  type: "delay_seconds",

  visualization: {
    colour: "0",
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [
    [ "%SECONDS seconds", {
      field: 'SECONDS',
      options: invokeMap(range(0, 60), "toString").map(seconds =>
        [ seconds, seconds ]
      )
      // options: [
      //   ['0', '0'],
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
