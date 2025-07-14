import { cleanDir, write, totalBytesWritten } from "./export_util.js"
import DefinitionSet from '#src/definition_set.js'
import { exportTo } from '#src/exporters/index.js'
import BlocklyJSExporter from '#src/blockly_js_exporter.js'


const toExport = process.argv[2]

if(!toExport) {
  console.error(`Export Error: Missing export name!\nUsage: node export.js [export name]`)
  process.exit(1)
}

const
  exporters = {
    "app": async () => {
      // load the definitions
      const definitions = await DefinitionSet.load()

      // clear the export directory
      cleanDir("export")

      // await definitions.export({ to: "export" })

      await exportTo("export", definitions, exportItem => {
        exportItem.toolbox("toolbox.json")
        exportItem.workspace("workspace.json")
        exportItem.blocks("blocks.json")
        exportItem.script("blockly_app.js")
      })
    },

    "docs": async () => {
      // Export.to("docs", defSet, exporter => {
      //   exporters.sidebar("blocks/_blocks_sidebar.json")
      //   exporters.blockPages(block => "blocks/${block.definitionPath}.md")
      //   exporters.blockExamples(block => "blocks/${block.definitionPath}/examples.json")
      // })
    },
  },
  exporterNames = Object.keys(exporters)

if(!exporterNames.includes(toExport)) {
  console.error(`Export Error: No exporter found for: "${toExport}"\nValid exporters: "${exporterNames.join('", "')}"`)
  process.exit(1)
}

const startTime = Date.now()
console.log(`\nStarting Export: ${toExport}`)
console.log("=======================")

const exporter = exporters[toExport]
await exporter()

const elapsed = Date.now() - startTime
console.log("=======================")
console.log(`🏁 Done. Wrote ${totalBytesWritten.toFixed(3)}k in ${elapsed}ms 🏁`)
