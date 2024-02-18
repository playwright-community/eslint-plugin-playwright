import { Rule, Scope } from 'eslint';
import * as ESTree from 'estree';
import {
  getExpectType,
  getParent,
  isPropertyAccessor,
  isTestCall,
} from '../utils/ast';
import { KnownCallExpression } from '../utils/types';

const isCatchCall = (
  node: ESTree.CallExpression,
): node is KnownCallExpression =>
  node.callee.type === 'MemberExpression' &&
  isPropertyAccessor(node.callee, 'catch');

const getTestCallExpressionsFromDeclaredVariables = (
  context: Rule.RuleContext,
  declaredVariables: readonly Scope.Variable[],
): ESTree.CallExpression[] => {
  return declaredVariables.reduce<ESTree.CallExpression[]>(
    (acc, { references }) => [
      ...acc,
      ...references
        .map(({ identifier }) => getParent(identifier))
        .filter(
          (node): node is ESTree.CallExpression =>
            node?.type === 'CallExpression' && isTestCall(context, node),
        ),
    ],
    [],
  );
};

export default {
  create(context) {
    let conditionalDepth = 0;
    let inTestCase = false;
    let inPromiseCatch = false;

    const increaseConditionalDepth = () => inTestCase && conditionalDepth++;
    const decreaseConditionalDepth = () => inTestCase && conditionalDepth--;

    return {
      CallExpression(node: ESTree.CallExpression) {
        if (isTestCall(context, node)) {
          inTestCase = true;
        }

        if (isCatchCall(node)) {
          inPromiseCatch = true;
        }

        const expectType = getExpectType(context, node);
        if (inTestCase && expectType && conditionalDepth > 0) {
          context.report({
            messageId: 'conditionalExpect',
            node,
          });
        }

        if (inPromiseCatch && expectType) {
          context.report({
            messageId: 'conditionalExpect',
            node,
          });
        }
      },
      'CallExpression:exit'(node) {
        if (isTestCall(context, node)) {
          inTestCase = false;
        }

        if (isCatchCall(node)) {
          inPromiseCatch = false;
        }
      },
      CatchClause: increaseConditionalDepth,
      'CatchClause:exit': decreaseConditionalDepth,
      ConditionalExpression: increaseConditionalDepth,
      'ConditionalExpression:exit': decreaseConditionalDepth,
      FunctionDeclaration(node) {
        const declaredVariables = context.sourceCode.getDeclaredVariables(node);
        const testCallExpressions = getTestCallExpressionsFromDeclaredVariables(
          context,
          declaredVariables,
        );

        if (testCallExpressions.length > 0) {
          inTestCase = true;
        }
      },
      IfStatement: increaseConditionalDepth,
      'IfStatement:exit': decreaseConditionalDepth,
      LogicalExpression: increaseConditionalDepth,
      'LogicalExpression:exit': decreaseConditionalDepth,
      SwitchStatement: increaseConditionalDepth,
      'SwitchStatement:exit': decreaseConditionalDepth,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow calling `expect` conditionally',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-conditional-expect.md',
    },
    messages: {
      conditionalExpect: 'Avoid calling `expect` conditionally`',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
