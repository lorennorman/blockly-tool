import fs from 'fs'

// make a tiny DSL
const withCleanDir = async (dirName, writeFunction) => {
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
    console.log(`/${exportFilename} (${bytesToWrite}k)`)
    totalBytesWritten += bytesToWrite
  }

  await writeFunction(write)

  return totalBytesWritten
}

import { importBlockJson, importBlockDefinitions, allBlockDefinitionsAndPaths } from './src/importer/block_importer.js'
import importToolboxJson from './src/importer/toolbox_importer.js'
import importWorkspaceJson from './src/importer/workspace_importer.js'
import importBlocklyJs from './src/importer/blockly_importer.js'
import { capitalize, filter, find, forEach, get, isArray, isObject, keyBy, map, mapValues, sortBy } from 'lodash-es'

const
  toolbox = await importToolboxJson(),
  categories = filter(toolbox.contents, { kind: 'category' }),
  categoryBlocksMap = mapValues(keyBy(categories, "name"), cat => map(cat.contents, "type"))

const pretty = jsObject => JSON.stringify(jsObject, null, 2) + "\n"

const toBlockMarkdown = definition => {
  const
    lineObjects = filter(map(filter(definition.lines, isArray), "[1]"), isObject),
    fields = filter(lineObjects, "field"),
    inputValues = filter(lineObjects, "inputValue"),
    inputStatements = filter(lineObjects, "inputStatement")

  return `---
title: "Block: ${definition.name}"
editLink: true
---

# Block: ${definition.name}

## Description
    ${ definition.visualization?.tooltip?.replaceAll("\n", "\n    ") || "No docs for this block, yet." }

## Workspace

<BlocklyWorkspace block="${ definition.type }" />

## Fields

${ fields.map(field =>
`### \`${ capitalize(field.field) }\`

- Text: ${ field.text || 'None' }
- Select:
  - ${ map(field.options||[], 0).join("\n  - ") }`
).join("\n\n") }

## Inputs

${ inputValues.map(inputValue =>
`### \`${ capitalize(inputValue.inputValue) }\`

- Check: ${inputValue.check || 'None' }
- Shadow: ${inputValue.shadow?.type || inputValue.shadow}`
).join("\n\n") }

${ inputStatements.map(inputStatement =>
`### \`${ capitalize(inputStatement.inputStatement) }\`

- Check: ${inputStatement.check || 'None' }`
).join("\n\n") }

## Output

${ capitalize(definition.connections?.output || "Unspecified") }

## Examples

Coming soon...
`
}

/** Begin Export Script */

const startTime = Date.now()
let totalBytes = 0

console.log("")
console.log("Starting Documentation Export")
console.log("=======================")

totalBytes += await withCleanDir("docs/blockly", () => {
  fs.cpSync("export", "docs/blockly", { recursive: true })
})

totalBytes += await withCleanDir("docs/blocks", async write => {
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
        find(blockSidebar.items, { text: categoryName }).items.push(sidebarEntry)
      }
    })
  })

  write('_blocks_sidebar.json', pretty(blockSidebar))
})



const elapsed = Date.now() - startTime
console.log("=======================")
console.log(`🏁 Done. Wrote ${totalBytes.toString().slice(0,5)}k in ${elapsed}ms 🏁`)
