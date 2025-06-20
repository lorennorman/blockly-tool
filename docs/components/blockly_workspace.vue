<template>
  <div id="blocklyDiv" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
// import "/blockly.min.js"
import { dispose, inject } from "/blockly_app.js"

console.log('what now')
onMounted(() => {
  console.log('mounted')
  inject("blocklyDiv", {})
})

onUnmounted(() => {
  console.log('unmounted')
  // clear workspace
  dispose()
})
</script>

<style>
div#blocklyDiv {
  width: 400px;
  height: 200px;
}
</style>
