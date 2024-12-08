import type { Mapping } from './mapping';

export const workflow: Mapping = {
  // HttpTrigger: (node) => ({
  //   type: 'HttpTrigger',
  //   value: node.toAST(flatMappings()),
  // }),
  // HttpTriggerArgs: (pathNode, methodNode) => ({
  //   path: pathNode.toAST(flatMappings()),
  //   method: methodNode.toAST(flatMappings()),
  // }),
  // HttpMethod: (node) => node.sourceString,
  // TableWorkflowActionType: (node) => node.sourceString,
  // TableWorkflowAction: (nameNode) => ({
  //   type: nameNode.toAST(flatMappings()),
  // }),
  // TableWorkflow: (node) => node.toAST(flatMappings()),
  // TableWorkflowArgs: (nameNode, triggerNode, actionsNode) => ({
  //   name: nameNode.toAST(flatMappings()),
  //   trigger: triggerNode.toAST(flatMappings()),
  //   actions: actionsNode.children.map((child) => child.toAST(flatMappings())),
  // }),
};
