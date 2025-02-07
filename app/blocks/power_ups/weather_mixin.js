// helper mixin for the weather block
// simplifies juggling the weather api keys by period type
export default {
  propertyOptionsForTime: function(timeKey) {
    return this.propertyOptions
  },

  propertyOptions: [
    [`Option A idx}`, "option_a"],
    [`Option B idx+}`, "option_b"],
    [`idx+} C Option `, "option_c"]
  ],
}
