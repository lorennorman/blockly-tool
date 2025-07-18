const processHelp = definition => {
  // TODO: rely on project configuration for docs site location
  const
    docsBlocksRoot = "https://adafruit.github.io/io-actions/blocks",
    thisBlockPredicate = definition.definitionPath.slice(0, -3)

  return { helpUrl: `${docsBlocksRoot}/${thisBlockPredicate}` }
}

export default processHelp
