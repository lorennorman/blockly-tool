import { capitalize, find, forEach, map } from 'lodash-es'

import { cleanDir, write, totalBytesWritten } from "./export_util.js"
import DefinitionSet from '#src/definition_set.js'
import toBlockMarkdown from "#src/docs/render_block.js"


/** Begin Export Script */

const startTime = Date.now()
console.log("\nStarting Documentation Export")
console.log("=======================")

const definitionSet = await DefinitionSet.load()

cleanDir("docs/blockly")
definitionSet.export({ to: "docs/blockly" })

cleanDir("docs/blocks")

const
  categories = definitionSet.getCategories(),

  // INIT SIDEBAR
  blockSidebar = {
    text: 'Blocks',
    items: map(categories, ({ name }) => ({
      text: name,
      collapsed: true,
      items: []
    }))
  }

forEach(definitionSet.blocks, blockDefinition => {
  // skip disabled blocks
  if(blockDefinition.disabled) { return }

  // mirror the blocks/**/*.js path structure
  const docPath = blockDefinition.definitionPath.replace(/.js$/, '.md')
  // DEDICATED DOC PAGE FOR BLOCK
  write(`docs/blocks/${docPath}`, toBlockMarkdown(blockDefinition))

  // BLOCK SIDEBAR ITEM
  const
    blockSidebarPath = `/blocks/${docPath.slice(0, -3)}`,
    sidebarEntry = {
      text: capitalize(blockDefinition.name),
      link: blockSidebarPath
    }

  // add links to each sidebar category we're a part of
  forEach(blockDefinition.getCategories(), category => {
    // if category contains this block, add to its sidebar
    const sidebarCategory = find(blockSidebar.items, { text: category.name })

    if(!sidebarCategory) {
      throw new Error(`Block category (${ category.name }) not present in sidebar!`)
    }

    // ADD TO SIDEBAR
    sidebarCategory.items.push(sidebarEntry)
  })
})

// WRITE SIDEBAR
write('docs/blocks/_blocks_sidebar.json', JSON.stringify(blockSidebar, null, 2) + "\n")

const elapsed = Date.now() - startTime
console.log("=======================")
console.log(`🏁 Done. Wrote ${totalBytesWritten.toFixed(3)}k in ${elapsed}ms 🏁`)
