export default block => {
  const mutator = block?.mutator

  return (mutator
    ? { mutator: block.type }
    : {})
}
