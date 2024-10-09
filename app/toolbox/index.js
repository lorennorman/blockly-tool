export default [
  {
    name: 'Triggers',
    colour: 20,
    label: [
      "Triggers determine when and whether an Action runs.",
      "You can have more than one trigger, each triggers separately.",
      "Actions cannot fire more than once in a 5 minute period."
    ],
    contents: [
      'when_data',
      'when_data_matching',
      'when_data_matching_state',
      'every_hour',
      'every_day',
    ]
  }, {
    name: 'Matchers',
    colour: 40,
    label: [
      "Matchers are used with Feed data Triggers.",
      "Your trigger fires based on whether the data matches.",
    ],
    contents: [
      'matcher_compare',
      'matcher_text_compare',
    ]
  }, {
    name: 'Logic',
    colour: 60,
    label: [
      "Basic logic: true, false, and, or, not, if-elseif-else"
    ],
    contents: [
      "io_logic_boolean",
      "io_logic_negate",
      "io_logic_operation",
      "io_controls_if",
      "io_logic_compare",
      "text_compare",
    ]
  }, {
    name: 'Math',
    colour: 120,
    label: [
      "Numbers, comparisons, arithmetic",
    ],
    contents: [
      "io_math_number",
      "io_logic_compare",
      "io_math_arithmetic",
    ]
  }, {
    name: 'Text',
    colour: 180,
    label: [
      "Text strings: short/multiline, compare, join, search, template",
    ],
    contents: [
      "io_text",
      "io_text_multiline",
      "text_template",
      "io_text_join",
      "text_compare",
    ]
  }, {
    name: 'Feeds',
    colour: 240,
    label: [
      "",
    ],
    contents: [
      "feed_selector",
      "action_publish",
    ]
  }, {
    name: 'Variables',
    colour: 300,
    label: [
      "",
    ],
    contents: [
      "io_variables_set",
      "io_variables_get"
    ], callback: workspace => {
      // called every time the category is opened

      // register a button callback by name
      // TODO: make a Button abstraction to wrap this up
      workspace.registerButtonCallback('new-variable', () => {
        const newVariableName = prompt("What is your variable called?")
        if(newVariableName) {
          workspace.createVariable(newVariableName)
        }
      })

      // pull the existing variables out of the workspace
      const variableIds = workspace.getAllVariables().map(v => v.getId())

      // category contents
      const contents = [
        // category label
        { kind: 'label', text: "Create variables that are local to your action" },
        { kind: 'label', text: "Use blocks to set a value and get it later" },
        // button for creating new variables
        {
          kind: 'button',
          text: ' Create New Variable ',
          callbackKey: 'new-variable' // references the registered function above
        },
        ...variableIds.flatMap(id => ([
          { // setter block for this variable
            kind: 'block',
            type: 'io_variables_set',
            fields: { VAR: { id }},
            inputs: { VALUE: { shadow: { type: 'io_text' } } }
          }, { // getter block for this variable
            kind: 'block',
            type: 'io_variables_get',
            fields: { VAR: { id }}
          }
        ])),
        { kind: 'label', text: "Unused variables are removed when you save." },
      ]

      return contents
    }},
  { name: 'Actions',
    colour: 360,
    label: [
      "",
    ],
    contents: [
      "action_log",
      "action_publish",
      "action_webhook",
      "action_email",
      "action_sms",
    ]},
]
