<script setup>
  import { onMounted, onUnmounted } from 'vue'
  import { dispose, inject } from "../blockly/blockly_app.js"
  import initialWorkspace from "../blockly/workspace.json"

  const
    { block, width="100%", height="200px", toolbox=true } = defineProps(
      ['block', 'width', 'height', 'toolbox']
    ),
    injectOptions = {},
    options = {
      injectOptions,
      workspaceJson: block
        ? {
            "blocks": {
              "languageVersion": 0,
              "blocks": [
                {
                  "type": block,
                  "deletable": false,
                  "x": 50,
                  "y": 50
                }
              ]
            }
          }
        : initialWorkspace
    }

  if(!toolbox) {
    injectOptions.toolbox = false
  }

  onMounted(() => {
    inject("blocklyDiv", options)
  })

  // clear workspace
  onUnmounted(() => {
    dispose()
  })
</script>

<template>
  <div id="blocklyDiv" />
</template>

<style>
  div#blocklyDiv {
    /* width: 100%; */
    width: v-bind(width);
    /* height: 200px; */
    height: v-bind(height);

    .injectionDiv {
      border-radius: 5px;
    }
  }
</style>
