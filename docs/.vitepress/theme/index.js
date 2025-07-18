import DefaultTheme from 'vitepress/theme'
import BlocklyWorkspace from "/components/blockly_workspace.vue"


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register your custom global components
    app.component('BlocklyWorkspace', BlocklyWorkspace)
  }
}
