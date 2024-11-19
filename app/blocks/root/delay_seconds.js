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
      options: [
        ['0', '0'],
        ['1', '1'],
        ['5', '5'],
        ['10', '10'],
        ['30', '30'],
        ['59', '59'],
      ]
    }]
  ],

  generators: {
    json: () => {

    }
  }
}
