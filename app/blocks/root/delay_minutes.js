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
    [ "%MINUTES minutes", {
      field: 'MINUTES',
      options: [
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
