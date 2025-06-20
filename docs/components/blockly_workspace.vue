<script setup>
  import { onMounted, onUnmounted } from 'vue'
  import { dispose, inject } from "../blockly/blockly.js"

  const
    props = defineProps(['block'])

  onMounted(() => {
    console.log('mounted, block:', props.block)
    inject("blocklyDiv", {
      injectOptions: { toolbox: false },
      workspaceJson: {
        "blocks": {
          "languageVersion": 0,
          "blocks": [
            {
              "type": props.block,
              "deletable": false,
              "x": 50,
              "y": 50
            }
          ]
        }
      }
    })
  })

  onUnmounted(() => {
    console.log('unmounted')
    // clear workspace
    dispose()
  })
</script>

<template>
  <div id="blocklyDiv" />
</template>

<style>
  div#blocklyDiv {
    width: 100%;
    height: 200px;

    .injectionDiv {
      border-radius: 5px;
    }
  }
</style>
