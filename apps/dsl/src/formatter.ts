import type { Node } from 'ohm-js';
import { toAST } from 'ohm-js/extras';
import type { Plugin } from 'prettier';

import { matchResult } from './parser';

export = {
  languages: [{ extensions: ['.faslh'], name: 'Faslh', parsers: ['faslh'] }],
  parsers: {
    faslh: {
      parse: (text, parsers, options) => {
        const result = matchResult(text);
        if (result.succeeded()) {
          console.log('Parsing succeeded!');
          return toAST(result);
        } else {
          console.log('Parsing failed!');
          throw new Error(result.message);
        }
      },
      locStart: (node: Node) => {
        return node.source.startIdx;
      },
      locEnd: (node: Node) => {
        return node.source.endIdx;
      },
      astFormat: 'faslh-ast',
    },
  },
  printers: {
    'faslh-ast': {
      print: (path, options, print) => {
        const node = (path.getValue())[0] as Node;
        switch (node.type) {
          case 'Function':
            return "Function"
          default:
        throw new Error(`Unknown node type: ${node.type}`);
        }
        // TODO: to be able to print the AST we need to know the type of each node
        // needs to create new AST that will have node location info and type
        // toAST(node);
      },
    },
  },
} as Plugin;
