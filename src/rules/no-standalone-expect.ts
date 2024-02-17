import { Rule } from 'eslint';
import * as ESTree from 'estree';
import {
  findParent,
  getExpectType,
  getParent,
  getStringValue,
  isDescribeCall,
  isFunction,
  isIdentifier,
  isTestCall,
} from '../utils/ast';

const getBlockType = (
  statement: ESTree.BlockStatement,
): 'function' | 'describe' | null => {
  const func = getParent(statement);

  if (!func) {
    throw new Error(
      `Unexpected BlockStatement. No parent defined. - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`,
    );
  }

  // functionDeclaration: function func() {}
  if (func.type === 'FunctionDeclaration') {
    return 'function';
  }

  if (isFunction(func) && func.parent) {
    const expr = func.parent;

    // arrow function or function expr
    if (expr.type === 'VariableDeclarator') {
      return 'function';
    }

    // if it's not a variable, it will be callExpr, we only care about describe
    if (expr.type === 'CallExpression' && isDescribeCall(expr)) {
      return 'describe';
    }
  }

  return null;
};

type BlockType = 'arrow' | 'describe' | 'function' | 'template' | 'test';

export default {
  create(context: Rule.RuleContext) {
    const callStack: BlockType[] = [];

    return {
      ArrowFunctionExpression(node) {
        if (node.parent?.type !== 'CallExpression') {
          callStack.push('arrow');
        }
      },
      'ArrowFunctionExpression:exit'() {
        if (callStack[callStack.length - 1] === 'arrow') {
          callStack.pop();
        }
      },

      BlockStatement(statement) {
        const blockType = getBlockType(statement);

        if (blockType) {
          callStack.push(blockType);
        }
      },
      'BlockStatement:exit'(statement: ESTree.BlockStatement) {
        if (callStack[callStack.length - 1] === getBlockType(statement)) {
          callStack.pop();
        }
      },

      CallExpression(node) {
        if (getExpectType(context, node)) {
          const parent = callStack.at(-1);

          if (!parent || parent === 'describe') {
            const root = findParent(node, 'CallExpression');
            context.report({
              messageId: 'unexpectedExpect',
              node: root ?? node,
            });
          }

          return;
        }

        if (isTestCall(context, node)) {
          callStack.push('test');
        }

        if (node.callee.type === 'TaggedTemplateExpression') {
          callStack.push('template');
        }
      },
      'CallExpression:exit'(node: ESTree.CallExpression) {
        const top = callStack[callStack.length - 1];

        if (
          (top === 'test' &&
            isTestCall(context, node) &&
            node.callee.type !== 'MemberExpression') ||
          (top === 'template' &&
            node.callee.type === 'TaggedTemplateExpression')
        ) {
          callStack.pop();
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow using `expect` outside of `test` blocks',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-to-contain.md',
    },
    fixable: 'code',
    messages: {
      unexpectedExpect: 'Expect must be inside of a test block',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
