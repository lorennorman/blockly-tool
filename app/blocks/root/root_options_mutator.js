
import Blockly from 'blockly'

/** Action settings on the root block */
export default {
  delaySeconds: 0,
  delayMode: 'extend',

  saveExtraState: function() {
    // console.log("saving root delay settings:", {
    //   delay: this.delaySeconds,
    //   delayMode: this.delayMode
    // })

    return {
      delaySeconds: this.delaySeconds,
      delayMode: this.delayMode,
    }
  },

  loadExtraState: function(state) {
    this.delaySeconds = state.delaySeconds || 0
    this.delayMode = state.delayMode || "extend"
    // console.log("loading root delay settings:", {
    //   delay: this.delaySeconds,
    //   delayMode: this.delayMode
    // })
  },

  decompose: function(workspace) {
    const delayBlock = workspace.newBlock('delay_settings')
    delayBlock.initSvg()

    console.log("decomposing:", this.delaySeconds)
    if(this.delaySeconds < 60) {
      const delayPeriodBlock = workspace.newBlock("delay_seconds")
      delayPeriodBlock.initSvg()
      delayPeriodBlock.setFieldValue(this.delaySeconds.toString(), "SECONDS")

      const
        { connection } = delayBlock.getInput("DELAY_PERIOD"),
        { outputConnection } = delayPeriodBlock

      connection.connect(outputConnection)
    }

    return delayBlock
  },

  compose: function(delayBlock) {
    const
      periodInput = delayBlock.getInputTargetBlock("DELAY_PERIOD"),
      value = periodInput?.getFieldValue("SECONDS") || 0

    console.log('compose', periodInput, value)
    this.delaySeconds = parseInt(value, 10)
  }
}
