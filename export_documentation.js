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
      console.log("mkdir:", exportDirname)
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
import { map } from 'lodash-es'



const toBlockMarkdown = definition => {
  return `---
title: "Block: ${definition.type}"
editLink: true
---
${ definition.visualization?.tooltip || "No docs for this block, yet." }
`
}

withCleanDir("docs/blocks", async write => {
  map(allBlockDefinitionsAndPaths, ({ path, definition }) => {
    // skip disabled blocks
    if(definition.disabled) { return }

    const blockKey = definition.type

    // mirror the blocks/**/*.js path structure
    const docPath = path.replace(/.js$/, '.md')
    // console.log(blockKey, docPath)
    write(docPath, toBlockMarkdown(definition))
    // console.log(key, Object.keys(definition))
  })
  // write("blocks.json", pretty(await importBlockJson()))
  // write("toolbox.json", pretty(await importToolboxJson()))
  // write("workspace.json", pretty(await importWorkspaceJson()))

  // // JS
  // write("blockly.js", await importBlocklyJs())
})
