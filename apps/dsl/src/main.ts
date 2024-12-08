// const grammar = require('./grammars.ohm-bundle');
import { readFileSync } from 'fs';
import { join } from 'path';

import { faslhAst, getAst } from './ast/cst-to-ast';
import { matchResult } from './parser';

// TODO: (only if we will send the grammars in the prompt)
// We might need to create refined version of the grammars specificly for fine - tuning
// the AST. the current grammar is designed to be fault-tolerant and to be able to parse
// different ways of writing the same thing (we are relaying on parser generator hence no control over the parsing part).
// Note: this is not important though cuz we relay on hard positionings of the tokens.
//
const result = matchResult(
  readFileSync(join(__dirname, 'assets', 'sources', '3.txt'), 'utf-8')
);

if (result.succeeded()) {
  console.log('Parsing succeeded!');
  // console.log(JSON.stringify(getFullAst(result), null, 2));
} else {
  console.log('Parsing failed!');
  console.error(result.message);
}
Error.stackTraceLimit = Infinity;

const results = faslhAst(getAst(result), {
  visitProgram(program) {
    const tables = program.visit();
    return tables.reduce<any[]>(
      (acc, table) => [...acc, this.visitTable(table)],
      []
    );
  },
  visitTable(table) {
    const { name, fields } = table.visit();
    return {
      name,
      fields: fields.map((field) => this.visitTableField(field)),
    };
  },
  visitTableField(field) {
    const { name, type } = field.visit();
    return { name, type };
  },
  visitQuery(it) {
    const { name, query } = it.visit();
    return { name, query };
  },
});

console.log(JSON.stringify(results, null, 2));
