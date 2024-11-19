export default {
  type: "delay_days",

  visualization: {
    colour: "0",
    tooltip: "1 day is the maximum delay available"
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
