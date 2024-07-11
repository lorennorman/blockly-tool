export default [
  { name: 'Logic', colour: 60 },
  { name: 'Math', colour: 120 },
  { name: 'Text', colour: 180 },
  { name: 'Variables', colour: 240, callback: workspace => {
    return [{
      'kind': 'block',
      'type': 'variables_set'
    }, {
      'kind': 'block',
      'type': 'variables_get'
    }]
  }},
  { name: 'Feeds', colour: 300 },
  { name: 'Actions', colour: 360 },
]
