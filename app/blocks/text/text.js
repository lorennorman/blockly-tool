export default {
  type: "io_text",
  name: "Text",
  colour: 180,
  description: "A String of text",

  connections: {
    mode: "value",
    output: "String",
  },

  template: `"%TEXT`,

  fields: {
    TEXT: {
      text: ''
    }
  },

  generators: {
    json: block => {
      const text = block.getFieldValue('TEXT')

      return [ JSON.stringify(text), 0 ]
    }
  }
}
