export default [
  {
    name: "Sentence Parts",
    color: 'blue',
    contents: [
      'subject',
      'predicate'
    ]
  },
  {
    name: "Callback Category",
    color: 'red',
    callback: workspace => {
      return [
        'predicate',
        'subject'
      ]
    }
  }
]
