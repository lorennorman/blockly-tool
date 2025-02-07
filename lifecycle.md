# Lifecycle of a Blockly App

## Using Blockly Tool

- generate new app
- configure
- run the dev server
- create a workspace, a toolbox, and some blocks
- run the exporter
- take your exported blockly files to where you want them

## Blockly (De)Serialization

When `Blockly.serialization.workspaces.load` is called, serializers are called in order with state to deserialize.

### Deserialization Order

1. **Variables**
2. **Procedures**
3. **Blocks** Top-level blocks are deserialized in an arbitrary order.
  1. **Type**
    - constructs the block, calls its init method, mixes in extensions
  2. **Attributes**
    - including global block properties, like: x, y, collapsed, disabled, and data
  3. **Extra state**
    - see the Extensions and Mutators
  4. **Parent Connection**
  5. **Icons**
    - arbitrary order
  6. **Fields**
    - arbitrary order
  7. **Input Blocks**
    - both value and statement inputs, arbitrary order
    - recursive
  8. **Next Blocks**
    - recursive
