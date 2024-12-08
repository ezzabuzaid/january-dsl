import type { Node } from 'ohm-js';

import type { Mapping} from './mapping';
import { flatMappings } from './mapping';

function process(node: Node) {
  if (node.isIteration()) {
    return {
      type: 'StringLiteral',
      value: node.children.map((child) => child.toAST(flatMappings())).join(''),
    };
  }
  const valueAst = node.toAST(flatMappings());
  return {
    type: valueAst.type === 'Integer' ? 'NumericLiteral' : 'StringLiteral',
    value: valueAst.value !== undefined ? valueAst.value : valueAst,
  };
}

export const utilities: Mapping = {
  // Comma: (node) => ({ value: node.sourceString, type: 'Comma' }),
  // Assignment: (node) => ({ value: node.sourceString, type: 'Assignment' }),
  // LParen: (node) => ({ value: node.sourceString, type: 'LParen' }),
  // RParen: (node) => ({ value: node.sourceString, type: 'RParen' }),
  // LBra: (node) => ({ value: node.sourceString, type: 'LBra' }),
  // RBra: (node) => ({ value: node.sourceString, type: 'RBra' }),
  Comma: (node) => {
    // ignore
  },
  Assignment: (node) => {
    // ignore
  },
  LParen: (node) => {
    // ignore
  },
  RParen: (node) => {
    // ignore
  },
  LBra: (node) => {
    // ignore
  },
  RBra: (node) => {
    // ignore
  },
  // SpecialChar: (node) => ({ value: node.sourceString, type: 'SpecialChar' }),
  // try {
  //   return { value: JSON.parse(evaluated), type: 'QuoteString' };
  // } catch (error) {
  //   // we support single quotes, double quotes and no quotes
  //   return { value: evaluated, type: 'QuoteString' };
  // }
  SpecialChar: (node) => node.sourceString,
  StringContent: (node) => process(node),
  NonQuotedString: (node) => process(node),
  QuoteString: (node) => process(node),
  SingleQuotedString: (_1, node, _2) => process(node),
  DoubleQuotedString: (_1, node, _2) => process(node),
  AnyString: (node) => process(node),
  String: (node) => process(node),
  PlainOrQuotes: (node) => process(node),
  Parameter: (nameNode, _1, valueNode, _2) => ({
    type: 'Parameter',
    name: nameNode.toAST(flatMappings()).value, // just get the value here. parameter name is always a string regardless of quotes or non-quotes
    value: valueNode.toAST(flatMappings()),
  }),
  ArrayParameter: (nameNode, _1, _2, valueNode, _3, _5) => ({
    type: 'ArrayParameter',
    name: nameNode.toAST(flatMappings()).value,
    value: valueNode.children
      .map((child) => child.toAST(flatMappings()))
      .flat() // using flat here because NonemptyListOf returns at least 3 children
      .filter(Boolean), // not sure why we need this. but it seems that there are some null values in the array
  }),
  Function: (nameNode, _1, valueNode, _2) => ({
    type: 'Function',
    name: nameNode.toAST(flatMappings()).value, // just get the value here. parameter name is always a string regardless of quotes or non-quotes
    parameters: valueNode.children
      .map((child) => child.toAST(flatMappings()))
      .filter(Boolean) // ignore null parameters (null parameters are those optional parameters that are not provided)
      .reduce((acc, it) => ({ ...acc, [it.name]: it.value }), {}),
  }),
};
