import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { NodeWithParent, TypedNodeWithParent } from './types';

export function getStringValue(node: ESTree.Node) {
  return node.type === 'TemplateLiteral'
    ? node.quasis[0].value.raw
    : node.type === 'Literal' && typeof node.value === 'string'
    ? node.value
    : '';
}

export function getNodeName(node: ESTree.Node) {
  return node.type === 'Identifier' ? node.name : undefined;
}

export function isIdentifier(node: ESTree.Node, name: string) {
  return getNodeName(node) === name;
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

export function getPropertyName(node: ESTree.MemberExpression) {
  return node.property.type === 'Identifier'
    ? node.property.name
    : getStringValue(node.property);
}

export function isPropertyAccessor(
  node: ESTree.MemberExpression,
  name: string
) {
  return getPropertyName(node) === name;
}

export function isCalleeObject(node: ESTree.CallExpression, name: string) {
  return (
    node.callee.type === 'MemberExpression' &&
    isIdentifier(node.callee.object, name)
  );
}

export function isCalleeProperty(node: ESTree.CallExpression, name: string) {
  return (
    node.callee.type === 'MemberExpression' &&
    isPropertyAccessor(node.callee, name)
  );
}

export function isTestIdentifier(node: ESTree.Node) {
  return (
    isIdentifier(node, 'test') ||
    (node.type === 'MemberExpression' && isIdentifier(node.object, 'test'))
  );
}

export function isObjectProperty(node: ESTree.MemberExpression, name: string) {
  return (
    node.object.type === 'MemberExpression' &&
    isIdentifier(node.object.property, name)
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

  return isIdentifier(inner.property, 'describe')
    ? true
    : describeProperties.has(getPropertyName(inner))
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

export function isTest(node: ESTree.CallExpression) {
  return (
    isTestIdentifier(node.callee) &&
    !isDescribeCall(node) &&
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
    node.callee.property.type === 'Identifier' &&
    testHooks.has(node.callee.property.name)
  );
}

const expectSubCommands = new Set(['soft', 'poll']);
export function isExpectCall(node: ESTree.CallExpression) {
  return (
    isIdentifier(node.callee, 'expect') ||
    (node.callee.type === 'MemberExpression' &&
      isIdentifier(node.callee.object, 'expect') &&
      node.callee.property.type === 'Identifier' &&
      expectSubCommands.has(node.callee.property.name))
  );
}

export function getMatchers(
  node: ESTree.Node & Rule.NodeParentExtension,
  chain: ESTree.Node[] = []
): ESTree.Node[] {
  if (node.parent.type === 'MemberExpression' && node.parent.object === node) {
    return getMatchers(node.parent, [...chain, node.parent.property]);
  }

  return chain;
}
