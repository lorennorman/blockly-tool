import { defineConfig } from 'vitepress'


const REPO = 'https://github.com/lorennorman/blockly-tool'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "IO Actions: Block Reference",
  description: "Documentation for Adafruit IO's block-based Actions",

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    editLink: {
      pattern: ({ filePath }) => {
        const jsPath = filePath.replace(/.md$/, '.js')

        return `https://github.com/lorennorman/blockly-tool/edit/main/app/${jsPath}`
      }
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Blocks',
        items: [
          { text: 'Email', link: '/blocks/action/email' },
          { text: 'Log', link: '/blocks/action/log' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: REPO }
    ]
  }
})
