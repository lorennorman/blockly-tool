# Blockly Tooling

A custom Blockly app needs to define:
- blocks
  - inputs
  - fields
  - generators
  - mixins
  - mutators
  - extensions
  - validators
- toolboxes
  - categories
  - buttons
- workspaces
  - starting blocks
  - settings
  - plugins

Blockly can be difficult to work with, as given. This is a clean space to experiment.

**Benefits of Making a Separate Project**
- host project stays cleaner
- tighter code-and-fix loop
- test in isolation
- deploy smaller experiments for feedback

## A Framework for a custom Blockly app

This is the core concept of the project: a better way of defining a custom Blockly application.

Better?
- expressive DSL
- keep related implementations together (Locality of Behavior)
- higher level idioms for common interactions

Check out the `/app` directory:
- `/app/blocks`
- `/app/toolbox`
- `/app/workspaces`

## Tools

### Transformer

Compiles a directory tree of DSL files into Blockly source files. This is where the main app is.

### Dev Environment

Provides a web application to host the Blockly project under development. Combines the Transformer with Vite to automatically compile and serve the app. The expressivity and ergonomics of the DSL coupled with this environment which instantly visualize changes as they are made is the point of this project: a reaosonable Blockly dev environment.

- lives in `/src`
- ingets from `/app`
- hosts app at `http://localhost:5173` (or something)

### Exporter

A brutal chunk of code to produce deployment-ready Blockly source files. Currently rough and ready, but effective. Lots of options should be supported but aren't.

- lives in `/exporter`
- ingests from `/app`
- exports to `/export`

- `/app`: custom Blockly app in development
- `/src`: the Blockly Tool application
- `/export`: where app files go when an export is performed
- `/dist`: where Blockly Tool app files go when exporting this application for testing and demonstration purposes
