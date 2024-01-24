import { map, range } from 'lodash-es'


export default {
  type: 'selector_minute',

  toolbox: {
    // category: 'Schedules',
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
      field: "MINUTE",
      options: map(map(range(60), String), idx => ([ idx, idx ]))
    }]
  ],

  generators: {
    json: block => {
      const minute = block.getFieldValue('MINUTE')

      return [ minute , 0 ]
    }
  }
}
