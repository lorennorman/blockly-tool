import optionalElseIfs from './io_controls_if/optional_else_ifs_extension.js'
import optionalElse from './io_controls_if/optional_else_extension.js'

export default {
  type: 'io_controls_if',

  toolbox: {
    category: 'Logic'
  },

  visualization: {
    colour: 60,
  },

  connections: {
    mode: "statement",
    output: "expression",
    next: 'expression'
  },

  extensions: { /*optionalElseIfs,*/ optionalElse },

  lines: [
    [ "if", { inputValue: 'IF0' }],
    [ "do", { inputStatement: 'THEN0' }],
    [ "else if", { inputDummy: 'ELSE_IF_LABEL' }],
    [ "else", { inputDummy: 'ELSE_LABEL' }]
  ],

  generators: {
    json: (block, generator) => {
      const payload = {
        conditional: {
          ifThens: []
        }
      }

      let index = 0
      while(block.getInput(`IF${index}`)) {
        const
          ifClause = generator.valueToCode(block, `IF${index}`, 0) || 'false',
          thenClause = generator.statementToCode(block, `THEN${index}`) || ''

        payload.conditional.ifThens.push({
          if: JSON.parse(ifClause),
          then: JSON.parse(`[ ${thenClause} ]`),
        })

        index += 1
      }

      if(block.getInput('ELSE')) {
        const elseClause = generator.statementToCode(block, 'ELSE') || ''

        payload.conditional.else = JSON.parse(`[${ elseClause }]`)
      }

      return JSON.stringify(payload)
    }
  }
}

// const blockData = {
//   'type': 'controls_if',
//   'message0': '%{BKY_CONTROLS_IF_MSG_IF} %1',
//   'args0': [
//     {
//       'type': 'input_value',
//       'name': 'IF0',
//       'check': 'Boolean',
//     },
//   ],
//   'message1': '%{BKY_CONTROLS_IF_MSG_THEN} %1',
//   'args1': [
//     {
//       'type': 'input_statement',
//       'name': 'DO0',
//     },
//   ],
//   'previousStatement': null,
//   'nextStatement': null,
//   'style': 'logic_blocks',
//   'helpUrl': '%{BKY_CONTROLS_IF_HELPURL}',
//   'suppressPrefixSuffix': true,
//   'mutator': 'controls_if_mutator',
//   'extensions': ['controls_if_tooltip'],
// }

// const CONTROLS_IF_MUTATOR_MIXIN = {
//   elseifCount_: 0,
//   elseCount_: 0,

//   /**
//    * Returns the state of this block as a JSON serializable object.
//    *
//    * @returns The state of this block, ie the else if count and else state.
//    */
//   saveExtraState: function (this: IfBlock): IfExtraState | null {
//     if (!this.elseifCount_ && !this.elseCount_) {
//       return null;
//     }
//     const state = Object.create(null);
//     if (this.elseifCount_) {
//       state['elseIfCount'] = this.elseifCount_;
//     }
//     if (this.elseCount_) {
//       state['hasElse'] = true;
//     }
//     return state;
//   },
//   /**
//    * Applies the given state to this block.
//    *
//    * @param state The state to apply to this block, ie the else if count
//    and
//    *     else state.
//    */
//   loadExtraState: function (this: IfBlock, state: IfExtraState) {
//     this.elseifCount_ = state['elseIfCount'] || 0;
//     this.elseCount_ = state['hasElse'] ? 1 : 0;
//     this.updateShape_();
//   },
//   /**
//    * Populate the mutator's dialog with this block's components.
//    *
//    * @param workspace MutatorIcon's workspace.
//    * @returns Root block in mutator.
//    */
//   decompose: function (this: IfBlock, workspace: Workspace): ContainerBlock {
//     const containerBlock = workspace.newBlock('controls_if_if');
//     (containerBlock as BlockSvg).initSvg();
//     let connection = containerBlock.nextConnection!;
//     for (let i = 1; i <= this.elseifCount_; i++) {
//       const elseifBlock = workspace.newBlock('controls_if_elseif');
//       (elseifBlock as BlockSvg).initSvg();
//       connection.connect(elseifBlock.previousConnection!);
//       connection = elseifBlock.nextConnection!;
//     }
//     if (this.elseCount_) {
//       const elseBlock = workspace.newBlock('controls_if_else');
//       (elseBlock as BlockSvg).initSvg();
//       connection.connect(elseBlock.previousConnection!);
//     }
//     return containerBlock;
//   },
//   /**
//    * Reconfigure this block based on the mutator dialog's components.
//    *
//    * @param containerBlock Root block in mutator.
//    */
//   compose: function (this: IfBlock, containerBlock: ContainerBlock) {
//     let clauseBlock =
//       containerBlock.nextConnection!.targetBlock() as ClauseBlock | null;
//     // Count number of inputs.
//     this.elseifCount_ = 0;
//     this.elseCount_ = 0;
//     // Connections arrays are passed to .reconnectChildBlocks_() which
//     // takes 1-based arrays, so are initialised with a dummy value at
//     // index 0 for convenience.
//     const valueConnections: Array<Connection | null> = [null];
//     const statementConnections: Array<Connection | null> = [null];
//     let elseStatementConnection: Connection | null = null;
//     while (clauseBlock) {
//       if (clauseBlock.isInsertionMarker()) {
//         clauseBlock = clauseBlock.getNextBlock() as ClauseBlock | null;
//         continue;
//       }
//       switch (clauseBlock.type) {
//         case 'controls_if_elseif':
//           this.elseifCount_++;
//           // TODO(#6920): null valid, undefined not.
//           valueConnections.push(
//             clauseBlock.valueConnection_ as Connection | null,
//           );
//           statementConnections.push(
//             clauseBlock.statementConnection_ as Connection | null,
//           );
//           break;
//         case 'controls_if_else':
//           this.elseCount_++;
//           elseStatementConnection =
//             clauseBlock.statementConnection_ as Connection | null;
//           break;
//         default:
//           throw TypeError('Unknown block type: ' + clauseBlock.type);
//       }
//       clauseBlock = clauseBlock.getNextBlock() as ClauseBlock | null;
//     }
//     this.updateShape_();
//     // Reconnect any child blocks.
//     this.reconnectChildBlocks_(
//       valueConnections,
//       statementConnections,
//       elseStatementConnection,
//     );
//   },
//   /**
//    * Store pointers to any connected child blocks.
//    *
//    * @param containerBlock Root block in mutator.
//    */
//   saveConnections: function (this: IfBlock, containerBlock: ContainerBlock) {
//     let clauseBlock =
//       containerBlock!.nextConnection!.targetBlock() as ClauseBlock | null;
//     let i = 1;
//     while (clauseBlock) {
//       if (clauseBlock.isInsertionMarker()) {
//         clauseBlock = clauseBlock.getNextBlock() as ClauseBlock | null;
//         continue;
//       }
//       switch (clauseBlock.type) {
//         case 'controls_if_elseif': {
//           const inputIf = this.getInput('IF' + i);
//           const inputDo = this.getInput('DO' + i);
//           clauseBlock.valueConnection_ =
//             inputIf && inputIf.connection!.targetConnection;
//           clauseBlock.statementConnection_ =
//             inputDo && inputDo.connection!.targetConnection;
//           i++;
//           break;
//         }
//         case 'controls_if_else': {
//           const inputDo = this.getInput('ELSE');
//           clauseBlock.statementConnection_ =
//             inputDo && inputDo.connection!.targetConnection;
//           break;
//         }
//         default:
//           throw TypeError('Unknown block type: ' + clauseBlock.type);
//       }
//       clauseBlock = clauseBlock.getNextBlock() as ClauseBlock | null;
//     }
//   },
//   /**
//    * Reconstructs the block with all child blocks attached.
//    */
//   rebuildShape_: function (this: IfBlock) {
//     const valueConnections: Array<Connection | null> = [null];
//     const statementConnections: Array<Connection | null> = [null];
//     let elseStatementConnection: Connection | null = null;

//     if (this.getInput('ELSE')) {
//       elseStatementConnection =
//         this.getInput('ELSE')!.connection!.targetConnection;
//     }
//     for (let i = 1; this.getInput('IF' + i); i++) {
//       const inputIf = this.getInput('IF' + i);
//       const inputDo = this.getInput('DO' + i);
//       valueConnections.push(inputIf!.connection!.targetConnection);
//       statementConnections.push(inputDo!.connection!.targetConnection);
//     }
//     this.updateShape_();
//     this.reconnectChildBlocks_(
//       valueConnections,
//       statementConnections,
//       elseStatementConnection,
//     );
//   },
//   /**
//    * Modify this block to have the correct number of inputs.
//    *
//    * @internal
//    */
//   updateShape_: function (this: IfBlock) {
//     // Delete everything.
//     if (this.getInput('ELSE')) {
//       this.removeInput('ELSE');
//     }
//     for (let i = 1; this.getInput('IF' + i); i++) {
//       this.removeInput('IF' + i);
//       this.removeInput('DO' + i);
//     }
//     // Rebuild block.
//     for (let i = 1; i <= this.elseifCount_; i++) {
//       this.appendValueInput('IF' + i)
//         .setCheck('Boolean')
//         .appendField(Msg['CONTROLS_IF_MSG_ELSEIF']);
//       this.appendStatementInput('DO' + i).appendField(
//         Msg['CONTROLS_IF_MSG_THEN'],
//       );
//     }
//     if (this.elseCount_) {
//       this.appendStatementInput('ELSE').appendField(
//         Msg['CONTROLS_IF_MSG_ELSE'],
//       );
//     }
//   },
//   /**
//    * Reconnects child blocks.
//    *
//    * @param valueConnections 1-based array of value connections for
//    *     'if' input.  Value at index [0] ignored.
//    * @param statementConnections 1-based array of statement
//    *     connections for 'do' input.  Value at index [0] ignored.
//    * @param elseStatementConnection Statement connection for else input.
//    */
//   reconnectChildBlocks_: function (
//     this: IfBlock,
//     valueConnections: Array<Connection | null>,
//     statementConnections: Array<Connection | null>,
//     elseStatementConnection: Connection | null,
//   ) {
//     for (let i = 1; i <= this.elseifCount_; i++) {
//       valueConnections[i]?.reconnect(this, 'IF' + i);
//       statementConnections[i]?.reconnect(this, 'DO' + i);
//     }
//     elseStatementConnection?.reconnect(this, 'ELSE');
//   },
// };
