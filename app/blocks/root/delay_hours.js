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
    [ "%HOURS hours", {
      field: 'HOURS',
      options: [
        ['1', '1'],
        ['5', '5'],
        ['10', '10'],
        ['24', '24'],
      ]
    }]
  ],

  generators: {
    json: () => {

    }
  }
}
