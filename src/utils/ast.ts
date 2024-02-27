import { Rule } from 'eslint';
import ESTree from 'estree';
import { isSupportedAccessor } from './parseFnCall';
import { NodeWithParent, TypedNodeWithParent } from './types';

export function getStringValue(node: ESTree.Node | undefined) {
  if (!node) return '';

  return node.type === 'Identifier'
    ? node.name
    : node.type === 'TemplateLiteral'
    ? node.quasis[0].value.raw
    : node.type === 'Literal' && typeof node.value === 'string'
    ? node.value
    : '';
}

export function getRawValue(node: ESTree.Node) {
  return node.type === 'Literal' ? node.raw : undefined;
}

export function isIdentifier(node: ESTree.Node, name?: string | RegExp) {
  return (
    node.type === 'Identifier' &&
    (!name ||
      (typeof name === 'string' ? node.name === name : name.test(node.name)))
  );
}

function isLiteral<T>(
  node: ESTree.Node,
  type: string,
  value?: T,
): node is ESTree.Literal {
  return (
    node.type === 'Literal' &&
    (value === undefined
      ? typeof node.value === type
      : (node.value as any) === value)
  );
}

const isTemplateLiteral = (
  node: ESTree.Node,
  value?: string,
): node is ESTree.TemplateLiteral =>
  node.type === 'TemplateLiteral' &&
  node.quasis.length === 1 && // bail out if not simple
  (value === undefined || node.quasis[0].value.raw === value);

export function isStringLiteral(
  node: ESTree.Node,
  value?: string,
): node is ESTree.Literal {
  return isLiteral(node, 'string', value);
}

export function isBooleanLiteral(
  node: ESTree.Node,
  value?: boolean,
): node is ESTree.Literal {
  return isLiteral(node, 'boolean', value);
}

export type StringNode = ESTree.Literal | ESTree.TemplateLiteral;

export function isStringNode(
  node: ESTree.Node,
  value?: string,
): node is StringNode {
  return (
    node && (isStringLiteral(node, value) || isTemplateLiteral(node, value))
  );
}

export function isPropertyAccessor(
  node: ESTree.MemberExpression,
  name: string,
) {
  return getStringValue(node.property) === name;
}

export function getParent(
  node: ESTree.Node,
): ESTree.Node & Rule.NodeParentExtension {
  return (node as NodeWithParent).parent;
}

export function findParent<T extends ESTree.Node['type']>(
  node: ESTree.Node,
  type: T,
): TypedNodeWithParent<T> | undefined {
  const parent = (node as NodeWithParent).parent;
  if (!parent) return;

  return parent.type === type
    ? (parent as unknown as TypedNodeWithParent<T>)
    : findParent(parent, type);
}

/**
 * Digs through a series of MemberExpressions and CallExpressions to find an
 * Identifier with the given name.
 */
export function dig(node: ESTree.Node, identifier: string | RegExp): boolean {
  return node.type === 'MemberExpression'
    ? dig(node.property, identifier)
    : node.type === 'CallExpression'
    ? dig(node.callee, identifier)
    : node.type === 'Identifier'
    ? isIdentifier(node, identifier)
    : false;
}

export function isPageMethod(node: ESTree.CallExpression, name: string) {
  return (
    node.callee.type === 'MemberExpression' &&
    dig(node.callee.object, /(^(page|frame)|(Page|Frame)$)/) &&
    isPropertyAccessor(node.callee, name)
  );
}

export type FunctionExpression = (
  | ESTree.ArrowFunctionExpression
  | ESTree.FunctionExpression
) &
  Rule.NodeParentExtension;

/** Returns a boolean to indicate if the node is a function or arrow function */
export function isFunction(
  node: ESTree.Node | undefined,
): node is FunctionExpression {
  return (
    node?.type === 'ArrowFunctionExpression' ||
    node?.type === 'FunctionExpression'
  );
}

export const equalityMatchers = new Set(['toBe', 'toEqual', 'toStrictEqual']);

const joinNames = (a: string | null, b: string | null): string | null =>
  a && b ? `${a}.${b}` : null;

export function getNodeName(node: ESTree.Node): string | null {
  if (isSupportedAccessor(node)) {
    return getStringValue(node);
  }

  switch (node.type) {
    case 'TaggedTemplateExpression':
      return getNodeName(node.tag);
    case 'MemberExpression':
      return joinNames(getNodeName(node.object), getNodeName(node.property));
    case 'NewExpression':
    case 'CallExpression':
      return getNodeName(node.callee);
  }

  return null;
}
