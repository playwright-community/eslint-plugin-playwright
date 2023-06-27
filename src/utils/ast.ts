import { Rule } from 'eslint';
import * as ESTree from 'estree';
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

export function isIdentifier(node: ESTree.Node, name: string | RegExp) {
  return (
    node.type === 'Identifier' &&
    (typeof name === 'string' ? node.name === name : name.test(node.name))
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

export function isStringLiteral(node: ESTree.Node, value?: string) {
  return isLiteral(node, 'string', value);
}

export function isBooleanLiteral(node: ESTree.Node, value?: boolean) {
  return isLiteral(node, 'boolean', value);
}

export function isPropertyAccessor(
  node: ESTree.MemberExpression,
  name: string
) {
  return getStringValue(node.property) === name;
}

export function isTestIdentifier(node: ESTree.Node) {
  return (
    isIdentifier(node, 'test') ||
    (node.type === 'MemberExpression' && isIdentifier(node.object, 'test'))
  );
}

const describeProperties = new Set([
  'parallel',
  'serial',
  'only',
  'skip',
  'fixme',
]);

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

export function findParent<T extends ESTree.Node['type']>(
  node: NodeWithParent,
  type: T
): TypedNodeWithParent<T> | undefined {
  if (!node.parent) return;

  return node.parent.type === type
    ? (node.parent as unknown as TypedNodeWithParent<T>)
    : findParent(node.parent, type);
}

export function isTest(node: ESTree.CallExpression, modifiers?: string[]) {
  return (
    isTestIdentifier(node.callee) &&
    !isDescribeCall(node) &&
    (node.callee.type !== 'MemberExpression' ||
      !modifiers ||
      modifiers?.includes(getStringValue(node.callee.property))) &&
    node.arguments.length === 2 &&
    ['ArrowFunctionExpression', 'FunctionExpression'].includes(
      node.arguments[1].type
    )
  );
}

const testHooks = new Set(['afterAll', 'afterEach', 'beforeAll', 'beforeEach']);
export function isTestHook(node: ESTree.CallExpression) {
  return (
    node.callee.type === 'MemberExpression' &&
    isIdentifier(node.callee.object, 'test') &&
    testHooks.has(getStringValue(node.callee.property))
  );
}

const expectSubCommands = new Set(['soft', 'poll']);
export type ExpectType = 'poll' | 'soft' | 'standalone';

export function getExpectType(
  node: ESTree.CallExpression
): ExpectType | undefined {
  if (isIdentifier(node.callee, /^expect|Expect$/)) {
    return 'standalone';
  }

  if (
    node.callee.type === 'MemberExpression' &&
    isIdentifier(node.callee.object, 'expect')
  ) {
    const type = getStringValue(node.callee.property);
    return expectSubCommands.has(type) ? (type as ExpectType) : undefined;
  }
}

export function isExpectCall(node: ESTree.CallExpression) {
  return !!getExpectType(node);
}

export function getMatchers(
  node: Rule.Node,
  chain: Rule.Node[] = []
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
function dig(node: ESTree.Node, identifier: string | RegExp): boolean {
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
