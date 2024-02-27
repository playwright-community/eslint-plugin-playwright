import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { getStringValue, isFunction } from '../utils/ast';
import { parseFnCall } from '../utils/parseFnCall';

const paramsLocation = (
  params: ESTree.CallExpression['arguments'] | ESTree.Pattern[],
) => {
  const [first] = params;
  const last = params[params.length - 1];

  return {
    end: last.loc!.end,
    start: first.loc!.start,
  };
};

export default {
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node, {
          includeConfigStatements: true,
        });
        if (call?.type !== 'describe') return;

        if (node.arguments.length < 1) {
          return context.report({
            loc: node.loc!,
            messageId: 'nameAndCallback',
          });
        }

        const [, callback] = node.arguments;

        if (!callback) {
          context.report({
            loc: paramsLocation(node.arguments),
            messageId: 'nameAndCallback',
          });

          return;
        }

        if (!isFunction(callback)) {
          context.report({
            loc: paramsLocation(node.arguments),
            messageId: 'secondArgumentMustBeFunction',
          });

          return;
        }

        if (callback.async) {
          context.report({
            messageId: 'noAsyncDescribeCallback',
            node: callback,
          });
        }

        if (
          call.members.every((s) => getStringValue(s) !== 'each') &&
          callback.params.length
        ) {
          context.report({
            loc: paramsLocation(callback.params),
            messageId: 'unexpectedDescribeArgument',
          });
        }

        if (callback.body.type === 'CallExpression') {
          context.report({
            messageId: 'unexpectedReturnInDescribe',
            node: callback,
          });
        }

        if (callback.body.type === 'BlockStatement') {
          callback.body.body.forEach((node) => {
            if (node.type === 'ReturnStatement') {
              context.report({
                messageId: 'unexpectedReturnInDescribe',
                node,
              });
            }
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Enforce valid `describe()` callback',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/valid-describe-callback.md',
    },
    messages: {
      nameAndCallback: 'Describe requires name and callback arguments',
      noAsyncDescribeCallback: 'No async describe callback',
      secondArgumentMustBeFunction: 'Second argument must be function',
      unexpectedDescribeArgument: 'Unexpected argument(s) in describe callback',
      unexpectedReturnInDescribe:
        'Unexpected return statement in describe callback',
    },
    schema: [],
    type: 'problem',
  },
} as Rule.RuleModule;
