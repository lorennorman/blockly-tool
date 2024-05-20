import { allBlockRegenerators } from './index.js'

// console.log('regeneartors:', allBlockRegenerators)
const BYTECODE_BLOCK_TYPE_MAP = {
  logAction: 'action_log',
  conditional: 'io_controls_if'
}

const lookupRegenerator = expressionName => {
  return allBlockRegenerators[expressionName] ||
    allBlockRegenerators[BYTECODE_BLOCK_TYPE_MAP[expressionName]]
}

const makeBlockType = (type, attrs={}) => {
  return { block: { type, ...attrs }}
}

const helpers = {
  objectExpressionToBlock: expressionBytecode => {
    const expKeys = Object.keys(expressionBytecode)

    if(expKeys.length !== 1) {
      throw new Error(`Block bytecode must have exactly 1 key, got: ${expKeys}`)
    }

    const
      expType = expKeys[0],
      blockRegenerator = lookupRegenerator(expType)

    if(!blockRegenerator) {
      throw new Error(`No regenerator defined for block type: ${expType}`)
    }

    const
      blockJson = blockRegenerator.json(expressionBytecode, helpers),
      collectionNames = ['inputs', 'fields']

    // remove any fields or inputs with null or undefined values
    collectionNames.forEach(collectionName => {
      const collection = blockJson[collectionName]
      if(!collection) { return }
      for (const [name, value] of Object.entries(collection)) {
        if(value === null || value === undefined) {
          console.warn(`Block type "${blockJson.type}" has null ${collectionName}: "${name}"`)
          delete collection[name]
        }
      }
    })

    return { block: blockJson }
  },

  expressionToBlock: expressionBytecode => {
    if(expressionBytecode === null || expressionBytecode === undefined) { return null }

    const expressionType = typeof expressionBytecode

    switch(expressionType) {
      case 'string':
        return makeBlockType("text", { fields: { "TEXT": expressionBytecode }})

      case 'number':
        return makeBlockType("math_number", { fields: { "NUM": expressionBytecode }})

      case 'boolean':
        return makeBlockType("logic_boolean", { fields: { "BOOL": expressionBytecode ? 'TRUE' : 'FALSE' }})

      case 'object':
        return helpers.objectExpressionToBlock(expressionBytecode)

      default: throw new Error(`Unrecognized expression type: ${expressionType}`)
    }
  },

  arrayToStatements: array => {
    return array.reduce((blocksDef, exp) => {
      const blockDef = helpers.objectExpressionToBlock(exp)

      // return this block if it's our first
      let diggingBlock = blocksDef.block
      if(!diggingBlock) {
        return blockDef
      }

      // dig down until we find a block without a next
      while(diggingBlock.next) {
        diggingBlock = diggingBlock.next.block
      }
      diggingBlock.next = blockDef

      return blocksDef
    }, {})
  }
}

export default {
  json: {
    codeToWorkspace: (bytecode) => {
      // check bytecode version
      // build workspace wrapper

      // hand subtree to root block's regenerate method
      const rootRegenerator = allBlockRegenerators.action_root.json

      return {
        "blocks": {
          "languageVersion": 0,
          "blocks": [ rootRegenerator(bytecode, helpers) ]
        }
      }
    }
  }
}
