import { allBlockRegenerators } from './index.js'

const BYTECODE_BLOCK_TYPE_MAP = {
  logAction: 'action_log',
  conditional: 'io_controls_if',
  compare: 'logic_compare',
  arithmetic: 'math_arithmetic',
  logic: 'logic_operation',
  negate: 'logic_negate',
  setVariable: 'variables_set',
  getVariable: 'variables_get',
  feed: 'feed_selector',
  publishAction: 'action_publish',
  webhookAction: 'action_webhook',
  emailAction: 'action_email',
  smsAction: 'action_sms',
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

  expressionToBlock: (expressionBytecode, options={}) => {
    if(expressionBytecode === null || expressionBytecode === undefined) {
      return options.shadow
        ? { shadow: { type: options.shadow }}
        : null
    }

    const expressionType = typeof expressionBytecode

    let expressionBlock
    switch(expressionType) {
      case 'string':
        expressionBlock = (expressionBytecode.includes("\n") || options.shadow === 'text_multiline')
          ? makeBlockType("text_multiline", { fields: { "TEXT": expressionBytecode }})
          : makeBlockType("text", { fields: { "TEXT": expressionBytecode }})
        break

      case 'number':
        expressionBlock = makeBlockType("math_number", { fields: { "NUM": expressionBytecode }})
        break

      case 'boolean':
        expressionBlock = makeBlockType("logic_boolean", { fields: { "BOOL": expressionBytecode ? 'TRUE' : 'FALSE' }})
        break

      case 'object':
        expressionBlock = helpers.objectExpressionToBlock(expressionBytecode)
        break

      default: throw new Error(`Unrecognized expression type: ${expressionType}`)
    }

    return options.shadow
      ? { ...expressionBlock, shadow: { type: options.shadow }}
      : expressionBlock
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