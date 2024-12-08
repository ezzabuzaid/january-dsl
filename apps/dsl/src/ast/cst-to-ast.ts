import type { MatchResult } from 'ohm-js';
import { toAST } from 'ohm-js/extras';

import type {
  Func,
  NumericLiteral,
  ParameterType,
  Program,
  StringLiteral,
} from './ast';
import { literals } from './mappings/literals';
import { flatMappings, registerMapping } from './mappings/mapping';
import { unions } from './mappings/unions';
import { utilities } from './mappings/utilites';

registerMapping('literals', literals);
registerMapping('utilities', utilities);
registerMapping('unions', unions);

export function getAst(matchResult: MatchResult): Program {
  return toAST(matchResult, flatMappings()) as Program;
}

namespace TypeChecker {
  export function isProgram(node: ParameterType): node is Program {
    return Array.isArray(node) ? false : node.type === 'Program';
  }
  export function isFunc(node: ParameterType): node is Func {
    return Array.isArray(node) ? false : node.type === 'Function';
  }
  export function isStringLiteral(node: ParameterType): node is StringLiteral {
    return Array.isArray(node) ? false : node.type === 'StringLiteral';
  }
  export function isNumericLiteral(
    node: ParameterType
  ): node is NumericLiteral {
    return Array.isArray(node) ? false : node.type === 'NumericLiteral';
  }
  export function isFuncArray(node: ParameterType): node is Func[] {
    return Array.isArray(node) && node.every(isFunc);
  }
}

export const faslhAst = (ast: Program, visitor: Visitor) => {
  const tables = ast.body.reduce<TableNode[]>((acc: TableNode[], it) => {
    if (it.type !== 'Function') {
      throw new Error('Only functions are allowed at the top level');
    }
    const { name, fields, queries } = it.parameters;
    if (!TypeChecker.isStringLiteral(name)) {
      throw new Error('Only string literals are allowed as table names');
    }
    if (!TypeChecker.isFuncArray(fields)) {
      throw new Error(
        'Only arrays of TableField functions are allowed as table fields'
      );
    }
    if (!TypeChecker.isFuncArray(queries)) {
      throw new Error(
        'Only arrays of TableQuery functions are allowed as table queries'
      );
    }

    const nomralizedFields = fields.reduce<TableFieldNode[]>((acc, field) => {
      const { name, type } = field.parameters;
      if (!TypeChecker.isStringLiteral(name)) {
        throw new Error('Only string literals are allowed as field names');
      }
      if (!TypeChecker.isStringLiteral(type)) {
        throw new Error('Only string literals are allowed as field types');
      }
      return [
        ...acc,
        {
          visit: () => ({ name: name.value, type: type.value }),
        },
      ];
    }, []);

    const normalizedQueries = queries.reduce<TableQueryNode[]>((acc, it) => {
      const { name, query } = it.parameters;
      if (!TypeChecker.isStringLiteral(name)) {
        throw new Error('Only string literals are allowed as query names');
      }
      if (!TypeChecker.isFunc(query)) {
        throw new Error(
          'Only arrays of TableQueryCondition functions are allowed as query conditions'
        );
      }
      const { conditions } = query.parameters;

      if (!TypeChecker.isFuncArray(conditions)) {
        throw new Error(
          'Only arrays of Where functions are allowed as query conditions'
        );
      }

      const normalizedConditions = conditions.reduce<WhereNode[]>(
        (acc, condition) => {
          const { input, operator } = condition.parameters;
          if (!TypeChecker.isStringLiteral(input)) {
            throw new Error('Only string literals are allowed as query input');
          }
          if (!TypeChecker.isFunc(operator)) {
            throw new Error(
              'Only arrays of QueryOperator functions are allowed as query operators'
            );
          }

          return [
            ...acc,
            {
              visit: () => ({
                input: input.value,
                operator: {
                  visit: () => {
                    //
                  },
                },
              }),
            },
          ];
        },
        []
      );

      return [
        ...acc,
        {
          visit: () => ({ name: name.value, query: normalizedConditions }),
        },
      ];
    }, []);

    return [
      ...acc,
      {
        visit: () => ({
          name: name.value,
          fields: nomralizedFields,
          queries: normalizedQueries,
        }),
      },
    ];
  }, []);
  return visitor.visitProgram({ visit: () => tables });
};

type Visit<T> = {
  visit(): T;
};

type ProgramNode = Visit<TableNode[]>;
type TableNode = Visit<{
  name: string;
  fields: TableFieldNode[];
  queries: TableQueryNode[];
}>;
type TableFieldNode = Visit<{ name: string; type: string }>;
type TableQueryNode = Visit<{ name: string; query: TableQueryConditionNode[] }>;
type TableQueryConditionNode = Visit<{ conditions: WhereNode[] }>;
type WhereNode = Visit<{ input: string; operator: QueryOperatorNode }>;
type QueryOperatorNode = Visit<void>;

interface Visitor {
  visitProgram(program: ProgramNode): void;
  visitTable(table: TableNode): void;
  visitTableField(field: TableFieldNode): void;
  visitQuery(query: TableQueryNode): void;
}
