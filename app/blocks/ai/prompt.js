export default {
  type: 'ai_prompt',

  toolbox: { },

  visualization: {
    colour: 180,
    tooltip: [
      "Prompt an LLM and get its response.",
      "-",
      "Inputs:",
      "---------------",
      "...",
    ].join('\n'),
  },

  lines: [
    "Ask an LLM",

    [ "Prompt:", { inputValue: 'PROMPT', shadow: "io_text" }],

    [ "Model:", {
      field: "MODEL",
      options: [
        ['Select a Model:', ''],
        ['-- OpenAI --', ''],
        ['GPT 4o', 'gpt-4o'],
        ['GPT 4o Mini', 'gpt-4o-mini'],
        ['GPT 4', 'gpt-4'],
        ['-- Anthropic --', ''],
        ['Claude 3 Opus', 'opus'],
        ['Claude 3 Sonnet', 'sonnet'],
        ['Claude 3 Haiku', 'haiku'],
        ['-- Google --', ''],
        ['Gemini Pro', 'gemini-pro'],
        ['Gemini Flash', 'gemini-flash'],
        ['-- Mixtral --', ''],
        ['Mistral Large', 'mistral-large'],
        ['Mistral Medium', 'mistral-medium'],
        ['Mistral Small', 'mistral-small'],
      ]
    }],
  ],

  generators: {
    json: (block, generator) => {
      const
        prompt = JSON.parse(generator.valueToCode(block, 'PROMPT', 0) || null),
        model = block.getFieldValue('MODEL'),

        blockPayload = JSON.stringify({
          aiPrompt: {
            prompt,
            model,
          },
        })

      return [ blockPayload, 0 ]
    }
  },

  regenerators: {
    json: (blockObject, helpers) => {
      const
        { prompt, model } = blockObject.aiPrompt,
        fields = {
          MODEL: model
        },
        inputs = {
          PROMPT: helpers.expressionToBlock(prompt, { shadow: "io_text" })
        }

      return { type: 'ai_prompt', fields, inputs }
    }
  }
}
