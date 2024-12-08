import type { Node } from 'ohm-js';

export const SKIP_TOKEN = [
  'Comma',
  'Assignment',
  'LParen',
  'RParen',
  'LBra',
  'RBra',
];

export function exclude(nodes: Node[], test: (node: Node) => boolean): Node[] {
  nodes = [...nodes];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (Array.isArray(node)) {
      exclude(node, test); // Recursively call the function for nested arrays
    } else if (test(node)) {
      nodes.splice(i, 1); // Remove the element from the array
      i--; // Decrement the index because the array has been modified
    }
  }
  return nodes.flat(Infinity);
}

export function excludeSkipTokens(nodes: Node[]): Node[] {
  return exclude(nodes, (node) => SKIP_TOKEN.includes(node.type));
}
