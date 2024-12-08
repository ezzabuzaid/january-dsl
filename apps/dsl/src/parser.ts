import { stripIndent } from 'common-tags';
import { readFileSync } from 'fs';
import * as ohm from 'ohm-js';
import { join } from 'path';

const contents = stripIndent(
  readFileSync(join(__dirname, 'assets', 'grammars.ohm'), 'utf-8')
);
const grammar = ohm.grammar(contents);

export const matchResult = (input: string) => {
  if (input.endsWith(';')) {
    // FIXME: I'm not able to get the grammar to work with a trailing semicolon
    // so I'm just removing it here.
    input = input.slice(0, -1);
  }
  return grammar.match(input);
};
