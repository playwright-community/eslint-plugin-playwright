import { Rule } from 'eslint';
import ESTree from 'estree';
import {
  getStringValue,
  isDescribeCall,
  isStringNode,
  isTestCall,
  StringNode,
} from '../utils/ast';

const doesBinaryExpressionContainStringNode = (
  binaryExp: ESTree.BinaryExpression,
): boolean => {
  if (isStringNode(binaryExp.right)) {
    return true;
  }

  if (binaryExp.left.type === 'BinaryExpression') {
    return doesBinaryExpressionContainStringNode(binaryExp.left);
  }

  return isStringNode(binaryExp.left);
};

const quoteStringValue = (node: StringNode): string =>
  node.type === 'TemplateLiteral'
    ? `\`${node.quasis[0].value.raw}\``
    : node.raw ?? '';

const compileMatcherPattern = (
  matcherMaybeWithMessage: MatcherAndMessage | string,
): CompiledMatcherAndMessage => {
  const [matcher, message] = Array.isArray(matcherMaybeWithMessage)
    ? matcherMaybeWithMessage
    : [matcherMaybeWithMessage];

  return [new RegExp(matcher, 'u'), message];
};

const compileMatcherPatterns = (
  matchers:
    | Partial<Record<MatcherGroups, string | MatcherAndMessage>>
    | MatcherAndMessage
    | string,
): Record<MatcherGroups, CompiledMatcherAndMessage | null> &
  Record<string, CompiledMatcherAndMessage | null> => {
  if (typeof matchers === 'string' || Array.isArray(matchers)) {
    const compiledMatcher = compileMatcherPattern(matchers);

    return {
      describe: compiledMatcher,
      test: compiledMatcher,
    };
  }

  return {
    describe: matchers.describe
      ? compileMatcherPattern(matchers.describe)
      : null,
    test: matchers.test ? compileMatcherPattern(matchers.test) : null,
  };
};

type CompiledMatcherAndMessage = [matcher: RegExp, message?: string];
type MatcherAndMessage = [matcher: string, message?: string];

const MatcherAndMessageSchema = {
  additionalItems: false,
  items: { type: 'string' },
  maxItems: 2,
  minItems: 1,
  type: 'array',
} as const;

type MatcherGroups = 'describe' | 'test';

interface Options {
  disallowedWords?: string[];
  ignoreSpaces?: boolean;
  ignoreTypeOfDescribeName?: boolean;
  ignoreTypeOfTestName?: boolean;
  mustMatch?:
    | Partial<Record<MatcherGroups, string | MatcherAndMessage>>
    | MatcherAndMessage
    | string;
  mustNotMatch?:
    | Partial<Record<MatcherGroups, string | MatcherAndMessage>>
    | MatcherAndMessage
    | string;
}

export default {
  create(context) {
    const opts: Options = context.options?.[0] ?? {};
    const {
      disallowedWords = [],
      ignoreSpaces = false,
      ignoreTypeOfDescribeName = false,
      ignoreTypeOfTestName = false,
      mustMatch,
      mustNotMatch,
    } = opts;
    const disallowedWordsRegexp = new RegExp(
      `\\b(${disallowedWords.join('|')})\\b`,
      'iu',
    );

    const mustNotMatchPatterns = compileMatcherPatterns(mustNotMatch ?? {});
    const mustMatchPatterns = compileMatcherPatterns(mustMatch ?? {});

    return {
      CallExpression(node) {
        const isDescribe = isDescribeCall(node);
        const isTest = isTestCall(context, node);
        if (!isDescribe && !isTest) {
          return;
        }

        const [argument] = node.arguments;
        if (!argument) {
          return;
        }

        if (!isStringNode(argument)) {
          if (
            argument.type === 'BinaryExpression' &&
            doesBinaryExpressionContainStringNode(argument)
          ) {
            return;
          }

          if (
            !(
              (isDescribe && ignoreTypeOfDescribeName) ||
              (isTest && ignoreTypeOfTestName)
            ) &&
            (argument as ESTree.Node).type !== 'TemplateLiteral'
          ) {
            context.report({
              loc: argument.loc!,
              messageId: 'titleMustBeString',
            });
          }

          return;
        }

        const title = getStringValue(argument);
        const functionName = isDescribe ? 'describe' : 'test';

        if (!title) {
          context.report({
            data: { functionName },
            messageId: 'emptyTitle',
            node,
          });

          return;
        }

        if (disallowedWords.length > 0) {
          const disallowedMatch = disallowedWordsRegexp.exec(title);

          if (disallowedMatch) {
            context.report({
              data: { word: disallowedMatch[1] },
              messageId: 'disallowedWord',
              node: argument,
            });

            return;
          }
        }

        if (ignoreSpaces === false && title.trim().length !== title.length) {
          context.report({
            fix: (fixer) => [
              fixer.replaceTextRange(
                argument.range!,
                quoteStringValue(argument)
                  .replace(/^([`'"]) +?/u, '$1')
                  .replace(/ +?([`'"])$/u, '$1'),
              ),
            ],
            messageId: 'accidentalSpace',
            node: argument,
          });
        }

        const [firstWord] = title.split(' ');
        if (firstWord.toLowerCase() === functionName) {
          context.report({
            fix: (fixer) => [
              fixer.replaceTextRange(
                argument.range!,
                quoteStringValue(argument).replace(/^([`'"]).+? /u, '$1'),
              ),
            ],
            messageId: 'duplicatePrefix',
            node: argument,
          });
        }

        const [mustNotMatchPattern, mustNotMatchMessage] =
          mustNotMatchPatterns[functionName] ?? [];

        if (mustNotMatchPattern && mustNotMatchPattern.test(title)) {
          context.report({
            data: {
              functionName,
              message: mustNotMatchMessage ?? '',
              pattern: String(mustNotMatchPattern),
            },
            messageId: mustNotMatchMessage
              ? 'mustNotMatchCustom'
              : 'mustNotMatch',
            node: argument,
          });

          return;
        }

        const [mustMatchPattern, mustMatchMessage] =
          mustMatchPatterns[functionName] ?? [];

        if (mustMatchPattern && !mustMatchPattern.test(title)) {
          context.report({
            data: {
              functionName,
              message: mustMatchMessage ?? '',
              pattern: String(mustMatchPattern),
            },
            messageId: mustMatchMessage ? 'mustMatchCustom' : 'mustMatch',
            node: argument,
          });

          return;
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce valid titles',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/valid-title.md',
    },
    fixable: 'code',
    messages: {
      accidentalSpace: 'should not have leading or trailing spaces',
      disallowedWord: '"{{ word }}" is not allowed in test titles',
      duplicatePrefix: 'should not have duplicate prefix',
      emptyTitle: '{{ functionName }} should not have an empty title',
      mustMatch: '{{ functionName }} should match {{ pattern }}',
      mustMatchCustom: '{{ message }}',
      mustNotMatch: '{{ functionName }} should not match {{ pattern }}',
      mustNotMatchCustom: '{{ message }}',
      titleMustBeString: 'Title must be a string',
    },
    schema: [
      {
        additionalProperties: false,
        patternProperties: {
          [/^must(?:Not)?Match$/u.source]: {
            oneOf: [
              { type: 'string' },
              MatcherAndMessageSchema,
              {
                additionalProperties: {
                  oneOf: [{ type: 'string' }, MatcherAndMessageSchema],
                },
                propertyNames: { enum: ['describe', 'test'] },
                type: 'object',
              },
            ],
          },
        },
        properties: {
          disallowedWords: {
            items: { type: 'string' },
            type: 'array',
          },
          ignoreSpaces: {
            default: false,
            type: 'boolean',
          },
          ignoreTypeOfDescribeName: {
            default: false,
            type: 'boolean',
          },
          ignoreTypeOfTestName: {
            default: false,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
} as Rule.RuleModule;
