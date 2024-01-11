import { map, range } from 'lodash-es'


export default {
  type: 'selector_minute',

  toolbox: {
    category: 'Schedules',
  },

  visualization: {
    colour: 184,
  },

  connections: {
    mode: 'value',
    output: 'cron_minute'
  },

  lines: [
    [ "Minute of Hour:", {
      field: "AT_MINUTE",
      options: map(map(range(60), String), idx => ([ idx, idx ]))
    }]
  ],

  generators: {
    json: block => {
      const minute = parseInt(block.getFieldValue('AT_MINUTE'), 10)

      return [ minute , 0 ]
    }
  }
}
