import { Rule, AST } from 'eslint';
import {
  getStringValue,
  isDescribeCall,
  isStringLiteral,
  isTest,
} from '../utils/ast';
import * as ESTree from 'estree';

type Method = 'test' | 'test.describe';

function isString(
  node: ESTree.Expression | ESTree.SpreadElement
): node is ESTree.Literal | ESTree.TemplateLiteral {
  return node && (isStringLiteral(node) || node.type === 'TemplateLiteral');
}

export default {
  create(context) {
    const { ignoreTopLevelDescribe, allowedPrefixes, ignore } = {
      ignore: [] as Method[],
      allowedPrefixes: [] as string[],
      ignoreTopLevelDescribe: false,
      ...((context.options?.[0] as {}) ?? {}),
    };

    let describeCount = 0;

    return {
      CallExpression(node) {
        const method = isDescribeCall(node)
          ? 'test.describe'
          : isTest(node)
          ? 'test'
          : null;

        if (method === 'test.describe') {
          describeCount++;

          if (ignoreTopLevelDescribe && describeCount === 1) {
            return;
          }
        } else if (!method) {
          return;
        }

        const [title] = node.arguments;
        if (!isString(title)) {
          return;
        }

        const description = getStringValue(title);
        if (
          !description ||
          allowedPrefixes.some((name) => description.startsWith(name))
        ) {
          return;
        }

        const firstCharacter = description.charAt(0);
        if (
          !firstCharacter ||
          firstCharacter === firstCharacter.toLowerCase() ||
          ignore.includes(method)
        ) {
          return;
        }

        context.report({
          messageId: 'unexpectedLowercase',
          node: node.arguments[0],
          data: { method },
          fix(fixer) {
            const rangeIgnoringQuotes: AST.Range = [
              title.range![0] + 1,
              title.range![1] - 1,
            ];

            const newDescription =
              description.substring(0, 1).toLowerCase() +
              description.substring(1);

            return fixer.replaceTextRange(rangeIgnoringQuotes, newDescription);
          },
        });
      },
      'CallExpression:exit'(node: ESTree.CallExpression) {
        if (isDescribeCall(node)) {
          describeCount--;
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce lowercase test names',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-lowercase-title.md',
    },
    messages: {
      unexpectedLowercase: '`{{method}}`s should begin with lowercase',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: {
              enum: ['test.describe', 'test'],
            },
            additionalItems: false,
          },
          allowedPrefixes: {
            type: 'array',
            items: { type: 'string' },
            additionalItems: false,
          },
          ignoreTopLevelDescribe: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
} as Rule.RuleModule;
