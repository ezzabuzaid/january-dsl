import type { Mapping} from './mapping';
import { flatMappings } from './mapping';

export const literals: Mapping = {
  // StringLiteral: (node) => ({
  //   type: 'StringLiteral',
  //   value: node.toAST(flatMappings()),
  // }),
  // NumericLiteral: (node) => ({
  //   type: 'NumericLiteral',
  //   value: node.toAST(flatMappings()),
  // }),
  Integer: (node) => ({
    type: 'Integer',
    value: node.children.map((child) => child.toAST(flatMappings())).join(''),
  }),
  UnsignedInteger: (signNode, valueNode) => ({
    type: 'UnsignedInteger',
    value: `-${valueNode.toAST(flatMappings()).value}`,
  }),
  Float: (leftSideNode, dotNode, rightSideNode) => ({
    type: 'FloatLiteral',
    value: `${leftSideNode.toAST(flatMappings())}.${rightSideNode.toAST(
      flatMappings()
    )}`,
  }),
};
