export default {
  name: 'Triggers',
  colour: "#11ab23",
  label: [
    "Triggers determine when and whether an Action runs.",
    "You can have more than one trigger, each triggers separately.",
    "Actions cannot fire more than once in a 5 minute period."
  ],
  contents: [
    'on_schedule',
    'when_data',
    'when_data_matching',
    'when_data_matching_state',
  ]
}
