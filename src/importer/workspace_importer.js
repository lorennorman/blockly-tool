import fs from 'fs'


export default () => {
  return JSON.parse(fs.readFileSync('./app/workspace/workspace.json'))
}
