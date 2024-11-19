export default {
  type: "delay_days",

  visualization: {
    colour: "0",
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [
    "1 day"
  ],

  generators: {
    json: () => {

    }
  }
}
