import type * as ESTree from 'estree';
import type { Rule } from 'eslint';
import { getNodeName } from '../utils/ast';

type MemberExpression = ESTree.MemberExpression & Rule.NodeParentExtension;

function getMemberExpressionNode(
  node: MemberExpression,
  matchers: Set<string>
) {
  const propertyName = getNodeName(node.property);

  if (getNodeName(node.object) === 'test') {
    return propertyName === 'step' ? { node, type: 'testStep' } : undefined;
  }

  return propertyName && matchers.has(propertyName)
    ? { node, type: 'expect' }
    : undefined;
}

const validTypes = new Set([
  'AwaitExpression',
  'ReturnStatement',
  'ArrowFunctionExpression',
]);

function isValid(node: MemberExpression) {
  return (
    validTypes.has(node.parent?.type) ||
    validTypes.has(node.parent?.parent?.type)
  );
}

const expectPlaywrightMatchers = [
  'toBeChecked',
  'toBeDisabled',
  'toBeEnabled',
  'toEqualText', // deprecated
  'toEqualUrl',
  'toEqualValue',
  'toHaveFocus',
  'toHaveSelector',
  'toHaveSelectorCount',
  'toHaveText', // deprecated
  'toMatchAttribute',
  'toMatchComputedStyle',
  'toMatchText',
  'toMatchTitle',
  'toMatchURL',
  'toMatchValue',
];

const playwrightTestMatchers = [
  'toBeChecked',
  'toBeDisabled',
  'toBeEditable',
  'toBeEmpty',
  'toBeEnabled',
  'toBeFocused',
  'toBeHidden',
  'toBeVisible',
  'toContainText',
  'toHaveAttribute',
  'toHaveClass',
  'toHaveCount',
  'toHaveCSS',
  'toHaveId',
  'toHaveJSProperty',
  'toBeOK',
  'toHaveScreenshot',
  'toHaveText',
  'toHaveTitle',
  'toHaveURL',
  'toHaveValue',
];

export default {
  create(context) {
    const options = context.options[0] || {};
    const matchers = new Set([
      ...expectPlaywrightMatchers,
      ...playwrightTestMatchers,
      // Add any custom matchers to the set
      ...(options.customMatchers || []),
    ]);

    return {
      MemberExpression(statement) {
        const result = getMemberExpressionNode(statement, matchers);

        if (result && !isValid(result.node)) {
          context.report({
            fix: (fixer) => fixer.insertTextBefore(result.node, 'await '),
            messageId: result.type,
            node: result.node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: `Identify false positives when async Playwright APIs are not properly awaited.`,
      recommended: true,
    },
    fixable: 'code',
    messages: {
      expect: "'expect' matchers must be awaited or returned.",
      testStep: "'test.step' must be awaited or returned.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          customMatchers: {
            items: { type: 'string' },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
} as Rule.RuleModule;
