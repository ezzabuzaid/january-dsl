import type { Mapping } from './mapping';

// FIXME: handle unkown values in this stage
// unions are enums so if a value is not in the enum it should be handled here
export const unions: Mapping = {
  TableWorkflowActionType: (node) => node.sourceString,
  HttpMethod: (node) => node.sourceString,
  QueryJoinType: (node) => node.sourceString,
};
