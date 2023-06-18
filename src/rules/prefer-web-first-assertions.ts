import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { getRawValue, getStringValue, isBooleanLiteral } from '../utils/ast';
import { parseExpectCall } from '../utils/parseExpectCall';

type MethodConfig = {
  inverse?: string;
  matcher: string;
  type: 'boolean' | 'string';
};

const methods: Record<string, MethodConfig> = {
  getAttribute: {
    matcher: 'toHaveAttribute',
    type: 'string',
  },
  innerText: { matcher: 'toHaveText', type: 'string' },
  inputValue: { matcher: 'toHaveValue', type: 'string' },
  isChecked: { matcher: 'toBeChecked', type: 'boolean' },
  isDisabled: {
    inverse: 'toBeEnabled',
    matcher: 'toBeDisabled',
    type: 'boolean',
  },
  isEditable: { matcher: 'toBeEditable', type: 'boolean' },
  isEnabled: {
    inverse: 'toBeDisabled',
    matcher: 'toBeEnabled',
    type: 'boolean',
  },
  isHidden: {
    inverse: 'toBeVisible',
    matcher: 'toBeHidden',
    type: 'boolean',
  },
  isVisible: {
    inverse: 'toBeHidden',
    matcher: 'toBeVisible',
    type: 'boolean',
  },
  textContent: { matcher: 'toHaveText', type: 'string' },
};

const supportedMatchers = new Set([
  'toBe',
  'toEqual',
  'toBeTruthy',
  'toBeFalsy',
]);

export function getMatcherCall(node: ESTree.Node) {
  const grandparent = (node as any).parent?.parent as ESTree.Node;
  return grandparent.type === 'CallExpression' ? grandparent : undefined;
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(node);
        if (!expectCall) return;

        const [arg] = node.arguments;
        if (
          arg.type !== 'AwaitExpression' ||
          arg.argument.type !== 'CallExpression' ||
          arg.argument.callee.type !== 'MemberExpression'
        ) {
          return;
        }

        // Matcher must be supported
        if (!supportedMatchers.has(expectCall.matcherName)) return;

        // Playwright method must be supported
        const method = getStringValue(arg.argument.callee.property);
        const methodConfig = methods[method];
        if (!methodConfig) return;

        // Change the matcher
        const { args, matcher } = expectCall;
        const notModifier = expectCall.modifiers.find(
          (mod) => getStringValue(mod) === 'not'
        );

        const isFalsy =
          methodConfig.type === 'boolean' &&
          ((!!args.length && isBooleanLiteral(args[0], false)) ||
            expectCall.matcherName === 'toBeFalsy');

        const isInverse = methodConfig.inverse
          ? notModifier || isFalsy
          : notModifier && isFalsy;

        // Replace the old matcher with the new matcher. The inverse
        // matcher should only be used if the old statement was not a
        // double negation.
        const newMatcher =
          (+!!notModifier ^ +isFalsy && methodConfig.inverse) ||
          methodConfig.matcher;

        const { callee } = arg.argument;
        context.report({
          data: {
            matcher: newMatcher,
            method,
          },
          fix: (fixer) => {
            const methodArgs =
              arg.argument.type === 'CallExpression'
                ? arg.argument.arguments
                : [];

            const methodEnd = methodArgs.length
              ? methodArgs[methodArgs.length - 1]!.range![1] + 1
              : callee.property.range![1] + 2;

            const fixes = [
              // Add await to the expect call
              fixer.insertTextBefore(node, 'await '),
              // Remove the await keyword
              fixer.replaceTextRange(
                [arg.range![0], arg.argument.range![0]],
                ''
              ),
              // Remove the old Playwright method and any arguments
              fixer.replaceTextRange(
                [callee.property.range![0] - 1, methodEnd],
                ''
              ),
            ];

            // Remove not from matcher chain if no longer needed
            if (isInverse && notModifier) {
              const notRange = notModifier.range!;
              fixes.push(fixer.removeRange([notRange[0], notRange[1] + 1]));
            }

            // Add not to the matcher chain if no inverse matcher exists
            if (!methodConfig.inverse && !notModifier && isFalsy) {
              fixes.push(fixer.insertTextBefore(matcher, 'not.'));
            }

            fixes.push(fixer.replaceText(matcher, newMatcher));

            // Remove boolean argument if it exists
            const [matcherArg] = args ?? [];
            if (matcherArg && isBooleanLiteral(matcherArg)) {
              fixes.push(fixer.remove(matcherArg));
            }

            // Add the new matcher arguments if needed
            const hasOtherArgs = !!methodArgs.filter(
              (arg) => !isBooleanLiteral(arg)
            ).length;

            if (methodArgs) {
              const range = matcher.range!;
              const stringArgs = methodArgs
                .map((arg) => getRawValue(arg))
                .concat(hasOtherArgs ? '' : [])
                .join(', ');

              fixes.push(
                fixer.insertTextAfterRange([range[0], range[1] + 1], stringArgs)
              );
            }

            return fixes;
          },
          messageId: 'useWebFirstAssertion',
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer web first assertions',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-web-first-assertions.md',
    },
    fixable: 'code',
    messages: {
      useWebFirstAssertion: 'Replace {{method}}() with {{matcher}}().',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
