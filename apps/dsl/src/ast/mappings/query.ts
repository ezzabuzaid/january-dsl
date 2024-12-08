import type { Mapping} from './mapping';
import { flatMappings } from './mapping';

const queryOperator = { value: 0 };
export const query: Mapping = {
  TableQuery: (node) => node.toAST(flatMappings()),
  TableQueryArgs: (nameNode, queryNode) => ({
    name: nameNode.toAST(flatMappings()),
    query: queryNode.children.map((child) => child.toAST(flatMappings())),
  }),
  QueryDsl: (node) => node.toAST(flatMappings()),
  QueryDslArgs: (conditionListNode, joinsNode, groupByNodes) => ({
    conditions: conditionListNode.children.map((child) =>
      child.toAST(flatMappings())
    ),
    joins: joinsNode.children.map((child) => child.toAST(flatMappings())),
    groupBy: groupByNodes.children.map((child) => child.toAST(flatMappings())),
  }),
  QueryConditionsList: (node) => node.toAST(flatMappings()),
  QueryWhere: (node) => ({ where: node.toAST(flatMappings()) }),
  QueryWhereArgs: (inputNode, operatorNode) => ({
    input: inputNode.toAST(flatMappings()),
    operator: operatorNode.toAST(flatMappings()),
  }),
  Equals: queryOperator,
  NotEquals: queryOperator,
  StartsWith: queryOperator,
  EndsWith: queryOperator,
  Contains: queryOperator,

  GreaterThan: queryOperator,
  GreaterThanOrEqual: queryOperator,
  LessThan: queryOperator,
  LessThanOrEqual: queryOperator,

  IsEmpty: queryOperator,
  IsNotEmpty: queryOperator,
  Is: queryOperator,

  Before: queryOperator,
  BeforeOn: queryOperator,
  After: queryOperator,
  AfterOn: queryOperator,
  Between: queryOperator,

  Add: queryOperator,
  Subtract: queryOperator,
  Multiply: queryOperator,
  Divide: queryOperator,

  AggregateSum: queryOperator,
  AggregateCount: queryOperator,
  AggregateAvg: queryOperator,
  AggregateMin: queryOperator,
  AggregateMax: queryOperator,

  QueryJoin: (node) => node.toAST(flatMappings()),
  QueryJoinArgs: (tableNameNode, conditionsNode) => ({
    tableName: tableNameNode.toAST(flatMappings()),
    conditions: conditionsNode.children
      .map((child) => child.toAST(flatMappings()))
      .flat(Infinity),
  }),
  AggregateArgs: (inputNode, aliasNode) => ({
    input: inputNode.toAST(flatMappings()),
    alias: aliasNode.toAST(flatMappings()),
  }),
  DateArgs: (valueNode, operandNode, unitNode) => ({
    value: valueNode.toAST(flatMappings()),
    operand: operandNode.toAST(flatMappings()),
    unit: unitNode.toAST(flatMappings())[0],
  }),
  ArithmeticArgs: (valueNode, operandNode, unitNode) => ({
    value: valueNode.toAST(flatMappings()),
    operand: operandNode.toAST(flatMappings()),
    unit: unitNode.toAST(flatMappings()),
  }),
  ComparisonArguments: (valueNode) => ({
    value: valueNode.toAST(flatMappings()),
  }),
  BetweenArguments: (minNode, maxNode) => ({
    min: minNode.toAST(flatMappings()),
    max: maxNode.toAST(flatMappings()),
  }),
  ArithmeticUnit: (node) => ({
    type: 'ArithmeticUnit',
    value: node.sourceString,
  }),
};
