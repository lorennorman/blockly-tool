import fs from 'fs'

// make a tiny DSL
const withCleanDir = async (dirName, writeFunction) => {
  const startTime = Date.now()
  console.log("Starting Documentation Export")
  console.log("=======================")

  if(fs.existsSync(dirName)) {
    fs.rmSync(dirName, { recursive: true, force: true })
  }
  fs.mkdirSync(dirName)
  console.log(`/${dirName}: clean`)

  let totalBytesWritten = 0
  const write = (filename, fileContents) => {
    const
      exportFilename = `${dirName}/${filename}`,
      exportDirname = exportFilename.split("/").slice(0, -1).join("/"),
      bytesToWrite = fileContents.length/1000

    // ensure dir is present before writing
    if(!fs.existsSync(exportDirname)) {
      fs.mkdirSync(exportDirname, { recursive: true })  
    }

    // write the file
    fs.writeFileSync(exportFilename, fileContents)

    // log and remember
    // console.log(`/${exportFilename} (${bytesToWrite}k)`)
    totalBytesWritten += bytesToWrite
  }

  await writeFunction(write)

  const elapsed = Date.now() - startTime
  console.log("=======================")
  console.log(`🏁 Done. Wrote ${totalBytesWritten.toString().slice(0,5)}k in ${elapsed}ms 🏁`)
}

import { importBlockJson, importBlockDefinitions, allBlockDefinitionsAndPaths } from './src/importer/block_importer.js'
import importToolboxJson from './src/importer/toolbox_importer.js'
import importWorkspaceJson from './src/importer/workspace_importer.js'
import importBlocklyJs from './src/importer/blockly_importer.js'
import { capitalize, filter, find, forEach, get, keyBy, map, mapValues, sortBy } from 'lodash-es'

const
  toolbox = await importToolboxJson(),
  categories = filter(toolbox.contents, { kind: 'category' }),
  categoryBlocksMap = mapValues(keyBy(categories, "name"), cat => map(cat.contents, "type"))

const pretty = jsObject => JSON.stringify(jsObject, null, 2) + "\n"

const toBlockMarkdown = definition => {
  return `---
title: "Block: ${definition.name}"
editLink: true
---

# Block: ${definition.name}

    ${ definition.visualization?.tooltip?.replaceAll("\n", "\n    ") || "No docs for this block, yet." }
`
}

withCleanDir("docs/blocks", async write => {
  const blockSidebar = {
    text: 'Blocks',
    items: map(categoryBlocksMap, (blocks, categoryName) => {
      return {
        text: categoryName,
        collapsed: true,
        items: []
      }
    })
  }

  forEach(allBlockDefinitionsAndPaths, ({ path, definition }) => {
    // skip disabled blocks
    if(definition.disabled) { return }

    // set a default name if missing
    if(!definition.name) {
      definition.name = capitalize(definition.type.replaceAll("_", " ").replace(/^io /, ""))
    }

    // mirror the blocks/**/*.js path structure
    const docPath = path.replace(/.js$/, '.md')
    write(docPath, toBlockMarkdown(definition))

    const
      blockSidebarPath = `/blocks/${docPath.slice(0, -3)}`,
      sidebarEntry = {
        text: capitalize(definition.name),
        link: blockSidebarPath
      }

    // add block links to the appropriate sidebar
    forEach(categoryBlocksMap, (categoryBlocks, categoryName) => {
      // if category contains this block, add to its sidebar
      if(categoryBlocks.includes(definition.type)) {
        console.log('found:', definition.type, 'in', categoryName)
        find(blockSidebar.items, { text: categoryName }).items.push(sidebarEntry)
      }
    })
  })

  write('_blocks_sidebar.json', pretty(blockSidebar))
})
