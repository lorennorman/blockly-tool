import fs from 'fs'

// make a tiny DSL
const withCleanDir = async (dirName, writeFunction) => {
  const startTime = Date.now()
  console.log("Starting Blockly Export")
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
      bytesToWrite = fileContents.length/1000

    fs.writeFileSync(exportFilename, fileContents)

    console.log(`/${exportFilename} (${bytesToWrite}k)`)
    totalBytesWritten += bytesToWrite
  }

  await writeFunction(write)

  const elapsed = Date.now() - startTime
  console.log("=======================")
  console.log(`🏁 Done (${totalBytesWritten}k/${elapsed}ms) 🏁`)
}

import { importBlockJson } from './src/importer/block_importer.js'
import importToolboxJson from './src/importer/toolbox_importer.js'
import importWorkspaceJson from './src/importer/workspace_importer.js'

import importBlocklyJs from './src/importer/blockly_importer.js'

withCleanDir("export", async write => {
  // JSON
  write("blocks.json", JSON.stringify(await importBlockJson(), null, 2))
  write("toolbox.json", JSON.stringify(await importToolboxJson(), null, 2))
  write("workspace.json", JSON.stringify(await importWorkspaceJson(), null, 2))

  // JS
  write("blockly.js", await importBlocklyJs())
})
