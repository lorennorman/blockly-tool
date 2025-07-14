architecture (WIP)
- file loaders
  - knows where files live
  - knows how to load the files
  - provides file contents and path they came from
- definition parsers
  - parses raw definitions into live objects
- definition set
  - central app object
  - loads all files
  - parses individual definitions into a collective set
  - provides accessors into the loaded set of app definitions
- dev server integration
  - vite plugin to hot reload app files from def file changes
- exporters:
  - resources (1 block, a toolbox category, etc)
    ...rolls up into
  - files (3 .jsons and a .js)
    ...rolls up into
  - apps (production app, docs site)

/loaders
  - block_loader.js
  - ...
/definitions
  - definition_set.js
  - block_definition.js
  - ...
/exporters
  - block_exporter.js
  - ...

...vs...

/blocks
  - block_loader.js
  - block_definition.js
  - block_exporter.js
/toolbox
  - toolbox_loader.js
  - toolbox_definition.js
  - toolbox_exporter.js
