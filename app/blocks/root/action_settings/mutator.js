
/** Action settings on the root block */
export default {
  delaySeconds: 0,
  delayMode: 'extend',

  saveExtraState: function() {
    return {
      delaySeconds: this.delaySeconds,
      delayMode: this.delayMode,
    }
  },

  loadExtraState: function({ delaySeconds, delayMode }) {
    this.delaySeconds = delaySeconds || 0
    this.delayMode = delayMode || "extend"
  },

  flyoutBlocks: [ 'delay_none', 'delay_seconds', 'delay_minutes', 'delay_hours', 'delay_days' ],

  decompose: function(workspace) {
    // initialize the top-level block for the sub-diagram
    const delaySettingsBlock = workspace.newBlock('delay_settings')
    delaySettingsBlock.initSvg()

    // set the appropriate delay block type by the seconds
    const delayBlockType = (this.delaySeconds <= 0) ? "delay_none"
      : (this.delaySeconds < 60) ? "delay_seconds"
      : (this.delaySeconds < 3600) ? "delay_minutes"
      : (this.delaySeconds < 86400) ? "delay_hours"
      : (this.delaySeconds >= 86400) ? "delay_days"
      : "delay_none"

    const delayPeriodBlock = workspace.newBlock(delayBlockType)
    delayPeriodBlock.initSvg()

    if(delayBlockType !== "delay_days" && delayBlockType !== "delay_none") {
      // set its seconds field (day doesn't have one)
      delayPeriodBlock.setFieldValue(this.delaySeconds.toString(), "SECONDS")
    }

    // connect it to the delay settings block
    const
      { connection } = delaySettingsBlock.getInput("DELAY_PERIOD"),
      { outputConnection } = delayPeriodBlock

    connection.connect(outputConnection)

    // set the mode field
    delaySettingsBlock.setFieldValue(this.delayMode, 'DELAY_MODE')

    return delaySettingsBlock
  },

  compose: function(delayBlock) {
    const
      periodInput = delayBlock.getInputTargetBlock("DELAY_PERIOD"),
      value = (periodInput?.type == "delay_days") // hard-code for day
        ? "86400"
        : periodInput?.getFieldValue("SECONDS") || 0

    this.delaySeconds = parseInt(value, 10)
    this.delayMode = delayBlock.getFieldValue("DELAY_MODE")
  }
}
