import fs from 'fs'

// export script helper function
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
      bytesToWrite = fileContents.length

    fs.writeFileSync(exportFilename, fileContents)

    console.log(`/${exportFilename}: ${bytesToWrite} bytes`)
    totalBytesWritten += bytesToWrite
  }

  await writeFunction(write)

  console.log(`${totalBytesWritten} bytes written.`)
}

import { importBlockJson } from './src/importer/block_importer.js'
import importToolboxJson from './src/importer/toolbox_importer.js'
import importWorkspaceJson from './src/importer/workspace_importer.js'

import importBlocklyJs from './src/importer/blockly_importer.js'


const startTime = Date.now()
console.log("Starting Blockly Export")
console.log("=======================")

withCleanDir("export", async write => {
  // JSON
  write("blocks.json", JSON.stringify(await importBlockJson(), null, 2))
  write("toolbox.json", JSON.stringify(await importToolboxJson(), null, 2))
  write("workspace.json", JSON.stringify(await importWorkspaceJson(), null, 2))

  // JS
  write("blockly.js", await importBlocklyJs())

  const elapsed = Date.now() - startTime
  console.log("=======================")
  console.log(`🏁 Done (${elapsed}ms) 🏁`)
})
