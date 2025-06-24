import fs from 'fs'


export let totalBytesWritten = 0
// make a tiny DSL
export const
  cleanDir = (dirName) => {
    if(fs.existsSync(dirName)) {
      fs.rmSync(dirName, { recursive: true, force: true })
    }
    fs.mkdirSync(dirName)
    console.log(`/${dirName}: clean`)
  },

  write = (filename, fileContents) => {
    const bytesToWrite = fileContents.length/1000

    fs.writeFileSync(filename, fileContents)

    console.log(`/${filename} (${bytesToWrite}k)`)
    totalBytesWritten += bytesToWrite
  }
