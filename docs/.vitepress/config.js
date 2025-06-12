import { defineConfig } from 'vitepress'
import blocksSidebar from '../blocks/_blocks_sidebar.json'


const REPO = 'https://github.com/lorennorman/blockly-tool'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "IO Actions: Block Reference",
  description: "Documentation for Adafruit IO's block-based Actions",

  head: [
    ['link', { rel: 'icon', href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧩</text></svg>" }]
  ],

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    search: {
      provider: 'local'
    },

    editLink: {
      pattern: ({ filePath }) => {
        // runs on the frontend, must be a pure function
        const jsPath = filePath.replace(/.md$/, '.js')

        return `https://github.com/lorennorman/blockly-tool/edit/main/app/${jsPath}`
      }
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      blocksSidebar
    ],

    socialLinks: [
      { icon: 'github', link: REPO }
    ]
  }
})
