import type { Mapping} from './mapping';
import { flatMappings } from './mapping';

export const table: Mapping = {
  TableArgs: (nameNode, fieldsNode, queriesNode, workflowsNode) => ({
    name: nameNode.toAST(flatMappings()),
    fields: fieldsNode.children.map((child) => child.toAST(flatMappings())),
    queries: queriesNode.children.map((child) => child.toAST(flatMappings())),
    workflows: workflowsNode.children.map((child) =>
      child.toAST(flatMappings())
    ),
  }),
  TableFieldArgs: (nameNode, fieldTypeNode, relatedEntityNode) => ({
    name: nameNode.toAST(flatMappings()),
    fieldType: fieldTypeNode.toAST(flatMappings()),
    relatedEntity: relatedEntityNode.toAST(flatMappings()) ?? undefined,
  }),
};
