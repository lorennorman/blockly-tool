import { map, range } from 'lodash-es'

export default {
  type: "every_day",

  toolbox: {
    category: 'Triggers'
  },

  visualization: {
    colour: 30,
    tooltip: "Run this action daily on the specified hour."
  },

  connections: {
    mode: "statement",
    output: "trigger",
    next: "trigger"
  },

  lines: [
    [ "...every day at %HOUR", {
      align: 'LEFT',
      fields: {
        HOUR: {
          options: [
            ["12 midnight", "0"],
            ["1am", "1"],
            ["2am", "2"],
            ["3am", "3"],
            ["4am", "4"],
            ["5am", "5"],
            ["6am", "6"],
            ["7am", "7"],
            ["8am", "8"],
            ["9am", "9"],
            ["10am", "10"],
            ["11am", "11"],
            ["12 noon", "12"],
            ["1pm", "13"],
            ["2pm", "14"],
            ["3pm", "15"],
            ["4pm", "16"],
            ["5pm", "17"],
            ["6pm", "18"],
            ["7pm", "19"],
            ["8pm", "20"],
            ["9pm", "21"],
            ["10pm", "22"],
            ["11pm", "23"],
          ]
        }
      }
    }],
  ],

  generators: {
    json: block => {
      const
        hour = block.getFieldValue('HOUR'),
        payload = JSON.stringify({
          hour
        })

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.hour

      return {
        type: "every_day",
        fields: {
          HOUR: payload.hour
        }
      }
    }
  }
}
