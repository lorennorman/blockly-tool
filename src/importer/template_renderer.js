import fs from 'fs'

// export const renderTemplate = async (templateFilePath) => {
//   // dynamically import the given template file
//   // e
// }

export const renderTemplate = (renderedContent, sourceFilename) => {
  // read in file contents
  const existingFileContent = fs.readFileSync(sourceFilename).toString()
  // return transformed contents
  return existingFileContent.replace(/\/\* LOCAL->>[\s\S]*?<<-LOCAL \*\//, renderedContent)
}

export default renderTemplate
