import { cleanDir, copyDir, write, totalBytesWritten } from "./export_util.js"

import toBlockMarkdown from "#src/docs/render_block.js"
import { allBlockDefinitionsAndPaths } from './src/importer/block_importer.js'
import importToolboxJson from './src/importer/toolbox_importer.js'
import { capitalize, filter, find, forEach, keyBy, map, mapValues } from 'lodash-es'

const
  toolbox = await importToolboxJson(),
  categories = filter(toolbox.contents, { kind: 'category' }),
  categoryBlocksMap = mapValues(keyBy(categories, "name"), cat => map(cat.contents, "type"))

const pretty = jsObject => JSON.stringify(jsObject, null, 2) + "\n"

// import DefinitionSet from '#src/definition_set.js'

/** Begin Export Script */

const startTime = Date.now()
console.log("\nStarting Documentation Export")
console.log("=======================")

// const definitionSet = await DefinitionSet.load()

cleanDir("docs/blockly")
// TODO: instead, export exactly what we need
copyDir("export", "docs/blockly")

cleanDir("docs/blocks")

// INIT SIDEBAR
const blockSidebar = {
  text: 'Blocks',
  // items: map(definitionSet.toolbox.categories, categoryName => {
  items: map(categoryBlocksMap, (blocks, categoryName) => {
    return {
      text: categoryName,
      collapsed: true,
      items: []
    }
  })
}

// forEach(definitionSet.blocks, ({ definitionPath, definition }) => {
forEach(allBlockDefinitionsAndPaths, ({ path, definition }) => {
  // skip disabled blocks
  if(definition.disabled) { return }

  // set a default name if missing
  // TODO: should happen in definition class
  if(!definition.name) {
    definition.name = capitalize(definition.type.replaceAll("_", " ").replace(/^io /, ""))
  }

  // mirror the blocks/**/*.js path structure
  const docPath = path.replace(/.js$/, '.md')
  write(`docs/blocks/${docPath}`, toBlockMarkdown(definition)) // EXPORT MARKDOWN

  // APPEND TO SIDEBAR
  const
    blockSidebarPath = `/blocks/${docPath.slice(0, -3)}`,
    sidebarEntry = {
      text: capitalize(definition.name),
      link: blockSidebarPath
    }

  // definition.categories
  // add block links to the appropriate sidebar
  forEach(categoryBlocksMap, (categoryBlocks, categoryName) => {
    // if category contains this block, add to its sidebar
    if(categoryBlocks.includes(definition.type)) {
      find(blockSidebar.items, { text: categoryName }).items.push(sidebarEntry)
    }
  })
})

// WRITE SIDEBAR
write('docs/blocks/_blocks_sidebar.json', pretty(blockSidebar))

const elapsed = Date.now() - startTime
console.log("=======================")
console.log(`🏁 Done. Wrote ${totalBytesWritten.toFixed(3)}k in ${elapsed}ms 🏁`)
