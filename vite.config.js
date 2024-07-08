import { defineConfig } from 'vite'

import ImportUserAppPlugin from './src/importer.js'


export default defineConfig({
  plugins: [ ImportUserAppPlugin() ]
})
