import fs from 'fs'

const workspace = JSON.parse(fs.readFileSync('./app/workspace/workspace.json'))
// import workspace from '../../app/workspace/workspace.json' assert { type: 'json' }

export default workspace
