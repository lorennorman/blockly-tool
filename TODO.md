# TODO:

loose doc to capture some ideas as i work

- events


## Events

Would be good to wrap events in a nice interface, as well.

Blockly events are bad, as written. You can attach listeners to the workspace or to blocks, but they fire on every workspace event and you have to filter out all the ones you don't care about:
```js
block.addChangeListener(function({ blockId, type, name, element, newValue, oldValue }) {
  if(!blockId || type !== "change" || workspace.getBlockById(blockId).type !== "weather" || element !== "field" || name !== "POWER_UP_ID") {
    return
  }

  // ...now do the work you care about

})
````

Would be nice to specify some of that at registration and have be handled automatically:
```js
listenFor({
  type: "change",
  block: [aBlock, "block-type", blockFunc(block)]
})
````

Then we can do the filtering efficiently, in one spot, with tests, and expose a nice interface, or layers of interfaces (kitchen sink/low-level vs porcelain/higher-order-functions)
