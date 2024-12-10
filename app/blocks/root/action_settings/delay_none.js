export default {
  type: "delay_none",

  visualization: {
    colour: "0",
    tooltip: "No delay: Actions run immediately when triggered."
  },

  connections: {
    mode: 'value',
    output: "delay_period",
  },

  lines: [ "No Delay" ],

  generators: {
    json: () => {

    }
  }
}
