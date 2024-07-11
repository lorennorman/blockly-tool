import { defineConfig } from 'vite'

import ImportUserAppPlugin from './src/importer/vite_plugin.js'


export default defineConfig({
  plugins: [ ImportUserAppPlugin() ]
})
