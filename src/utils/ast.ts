import { Rule } from 'eslint';
import ESTree from 'estree';
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

export function isIdentifier(
  node: ESTree.Node,
  name: string | RegExp | undefined,
) {
  return (
    node.type === 'Identifier' &&
    (!name ||
      (typeof name === 'string' ? node.name === name : name.test(node.name)))
  );
}

function isLiteral<T>(node: ESTree.Node, type: string, value?: T) {
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

export function isStringLiteral(node: ESTree.Node, value?: string) {
  return isLiteral(node, 'string', value);
}

export function isBooleanLiteral(node: ESTree.Node, value?: boolean) {
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

export function getTestNames(context: Rule.RuleContext) {
  const aliases = context.settings.playwright?.globalAliases?.test ?? [];
  return ['test', ...aliases];
}

export function isTestIdentifier(context: Rule.RuleContext, node: ESTree.Node) {
  const testNames = getTestNames(context);
  const regex = new RegExp(`^(${testNames.join('|')})$`);

  return (
    isIdentifier(node, regex) ||
    (node.type === 'MemberExpression' && isIdentifier(node.object, regex))
  );
}

const describeProperties = new Set([
  'parallel',
  'serial',
  'only',
  'skip',
  'fixme',
]);

/** @deprecated */
export function isDescribeCall(node: ESTree.Node): boolean {
  const inner = node.type === 'CallExpression' ? node.callee : node;

  // Allow describe without test prefix
  if (isIdentifier(inner, 'describe')) {
    return true;
  }

  if (inner.type !== 'MemberExpression') {
    return false;
  }

  return isPropertyAccessor(inner, 'describe')
    ? true
    : describeProperties.has(getStringValue(inner.property))
    ? isDescribeCall(inner.object)
    : false;
}

export function getParent(node: ESTree.Node): ESTree.Node | undefined {
  return (node as any).parent;
}

export function findParent<T extends ESTree.Node['type']>(
  node: NodeWithParent,
  type: T,
): TypedNodeWithParent<T> | undefined {
  if (!node.parent) return;

  return node.parent.type === type
    ? (node.parent as unknown as TypedNodeWithParent<T>)
    : findParent(node.parent, type);
}

/** @deprecated */
export function isTestCall(
  context: Rule.RuleContext,
  node: ESTree.CallExpression,
  modifiers?: string[],
) {
  return (
    isTestIdentifier(context, node.callee) &&
    !isDescribeCall(node) &&
    (node.callee.type !== 'MemberExpression' ||
      !modifiers ||
      modifiers?.includes(getStringValue(node.callee.property))) &&
    node.arguments.length === 2 &&
    isFunction(node.arguments[1])
  );
}

const expectSubCommands = new Set(['soft', 'poll']);
export type ExpectType = 'poll' | 'soft' | 'standalone';

/** @deprecated */
export function getExpectType(
  context: Rule.RuleContext,
  node: ESTree.CallExpression,
): ExpectType | undefined {
  const aliases = context.settings.playwright?.globalAliases?.expect ?? [];
  const expectNames = ['expect', ...aliases];
  const regex = new RegExp(`(^(${expectNames.join('|')})|Expect)$`);

  if (isIdentifier(node.callee, regex)) {
    return 'standalone';
  }

  if (
    node.callee.type === 'MemberExpression' &&
    // TODO: Maybe
    isIdentifier(node.callee.object, 'expect')
  ) {
    const type = getStringValue(node.callee.property);
    return expectSubCommands.has(type) ? (type as ExpectType) : undefined;
  }
}

export function isExpectCall(
  context: Rule.RuleContext,
  node: ESTree.CallExpression,
) {
  return !!getExpectType(context, node);
}

export function getMatchers(
  node: Rule.Node,
  chain: Rule.Node[] = [],
): Rule.Node[] {
  if (node.parent.type === 'MemberExpression' && node.parent.object === node) {
    return getMatchers(node.parent, [
      ...chain,
      node.parent.property as Rule.Node,
    ]);
  }

  return chain;
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
