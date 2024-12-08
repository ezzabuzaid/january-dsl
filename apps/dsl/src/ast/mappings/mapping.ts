import type { Node } from 'ohm-js';

export type Mapping = Record<
  string,
  ((...nodes: Node[]) => any) | Record<string, number>
>;

const _mappings: Record<string, Mapping> = {
  Program: {
    Root: (node) => ({
      body: node.children.map((child) => child.toAST(flatMappings())).flat(), // FIXME: flat should be removed
      type: 'Program',
    }),
  },
};
export function registerMapping(name: string, mapping: Mapping) {
  _mappings[name] = mapping;
  return mapping;
}
export function flatMappings() {
  return Object.values(_mappings).reduce((acc, it) => ({ ...acc, ...it }), {});
}
