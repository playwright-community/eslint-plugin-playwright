import { Rule } from 'eslint';
import ESTree from 'estree';
import {
  getExpectType,
  getMatchers,
  getStringValue,
  isIdentifier,
  isPropertyAccessor,
} from '../utils/ast';

const validTypes = new Set([
  'AwaitExpression',
  'ReturnStatement',
  'ArrowFunctionExpression',
]);

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
  'toHaveValues',
  'toBeAttached',
  'toBeInViewport',
];

function getCallType(
  node: ESTree.CallExpression & Rule.NodeParentExtension,
  awaitableMatchers: Set<string>,
) {
  // test.step
  if (
    node.callee.type === 'MemberExpression' &&
    isIdentifier(node.callee.object, 'test') &&
    isPropertyAccessor(node.callee, 'step')
  ) {
    return { messageId: 'testStep', node };
  }

  const expectType = getExpectType(node);
  if (!expectType) return;

  const [lastMatcher] = getMatchers(node).slice(-1);
  const grandparent = lastMatcher?.parent?.parent;

  // If the grandparent is not a CallExpression, then it's an incomplete
  // expect statement, and we don't need to check it.
  if (grandparent?.type !== 'CallExpression') return;

  const matcherName = getStringValue(lastMatcher);

  // The node needs to be checked if it's an expect.poll expression or an
  // awaitable matcher.
  if (expectType === 'poll' || awaitableMatchers.has(matcherName)) {
    return {
      data: { matcherName },
      messageId: expectType === 'poll' ? 'expectPoll' : 'expect',
      node: grandparent,
    };
  }
}

export default {
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const options = context.options[0] || {};
    const awaitableMatchers = new Set([
      ...expectPlaywrightMatchers,
      ...playwrightTestMatchers,
      // Add any custom matchers to the set
      ...(options.customMatchers || []),
    ]);

    function checkValidity(node: Rule.Node) {
      // If the parent is a valid type (e.g. return or await), we don't need to
      // check any further.
      if (validTypes.has(node.parent.type)) return true;

      // If the parent is an array, we need to check the grandparent to see if
      // it's a Promise.all, or a variable.
      if (node.parent.type === 'ArrayExpression') {
        return checkValidity(node.parent);
      }

      // If the parent is a call expression, we need to check the grandparent
      // to see if it's a Promise.all.
      if (
        node.parent.type === 'CallExpression' &&
        node.parent.callee.type === 'MemberExpression' &&
        isIdentifier(node.parent.callee.object, 'Promise') &&
        isIdentifier(node.parent.callee.property, 'all')
      ) {
        return true;
      }

      // If the parent is a variable declarator, we need to check the scope to
      // find where it is referenced. When we find the reference, we can
      // re-check validity.
      if (node.parent.type === 'VariableDeclarator') {
        const scope = sourceCode.getScope(node.parent.parent);

        for (const ref of scope.references) {
          const refParent = (ref.identifier as Rule.Node).parent;

          // If the parent of the reference is valid, we can immediately return
          // true. Otherwise, we'll check the validity of the parent to continue
          // the loop.
          if (validTypes.has(refParent.type)) return true;
          if (checkValidity(refParent)) return true;
        }
      }

      return false;
    }

    return {
      CallExpression(node) {
        const result = getCallType(node, awaitableMatchers);
        console.log(result);
        const isValid = result ? checkValidity(result.node) : false;

        if (result && !isValid) {
          context.report({
            data: result.data,
            fix: (fixer) => fixer.insertTextBefore(node, 'await '),
            messageId: result.messageId,
            node: node.callee,
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
      expect: "'{{matcherName}}' must be awaited or returned.",
      expectPoll: "'expect.poll' matchers must be awaited or returned.",
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
