import { defineConfig, loadEnv } from 'vite'

import ImportUserAppPlugin from './src/importer/vite_plugin.js'


export default defineConfig(({ mode }) => {
  const
    env = loadEnv(mode, process.cwd(), ''),
    plugins = env.NODE_ENV == 'development'
      ? [ ImportUserAppPlugin() ]
      : []

  return {
    plugins
  }
})
