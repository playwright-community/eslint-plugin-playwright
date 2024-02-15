import { AST, Rule, Scope, SourceCode } from 'eslint';
import * as ESTree from 'estree';
import { isFunction, isPageMethod } from '../utils/ast';
import { getSourceCode, truthy } from '../utils/misc';

/** Collect all variable references in the parent scopes recursively. */
function collectVariables(scope: Scope.Scope | null): string[] {
  if (!scope) return [];

  return [
    ...collectVariables(scope.upper),
    ...scope.variables.map((ref) => ref.name),
  ];
}

/** Add the variables from the outer scope as arguments to `page.evaluate()` */
function addArgument(
  fixer: Rule.RuleFixer,
  node: ESTree.CallExpression,
  refs: string,
) {
  // This should never happen, but just in case
  if (!node.arguments.length) return;

  // If there the only one argument to `page.evaluate()` is the function, we
  // have to add the references as the second argument.
  if (node.arguments.length === 1) {
    return fixer.insertTextAfter(node.arguments[0], `, [${refs}]`);
  }

  // If there are at least two arguments, we can add the references after the
  // last element of the second argument, which should be an array.
  const arr = node.arguments.at(-1);
  if (!arr || arr.type !== 'ArrayExpression') return;

  // It's possible the array is provided but empty, in which case we can just
  // replace it with the references.
  const lastItem = arr.elements.at(-1);
  return lastItem
    ? fixer.insertTextAfter(lastItem, `, ${refs}`)
    : fixer.replaceText(arr, `[${refs}]`);
}

/** Get the opening parenthesis of the function. */
function getParen(sourceCode: SourceCode, node: ESTree.Node): AST.Token | null {
  let token: AST.Token | null = sourceCode.getFirstToken(node);

  while (token && token.value !== '(') {
    token = sourceCode.getTokenAfter(token);
  }

  return token;
}

/** Add a parameter to the function. */
function addParam(
  sourceCode: SourceCode,
  fixer: Rule.RuleFixer,
  node: ESTree.ArrowFunctionExpression | ESTree.FunctionExpression,
  refs: string,
) {
  // If the function has params, add the reference after the last one
  const lastParam = node.params.at(-1);
  if (lastParam) {
    return fixer.insertTextAfter(lastParam, `, ${refs}`);
  }

  // If the function has no params, add the reference after the opening parenthesis
  const token = getParen(sourceCode, node);
  return token ? fixer.insertTextAfter(token, `[${refs}]`) : null;
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (!isPageMethod(node, 'evaluate')) return;

        const [fn] = node.arguments;
        if (!fn || !isFunction(fn)) return;

        const sourceCode = getSourceCode(context);
        const { through, upper } = sourceCode.getScope(fn.body);
        const allRefs = new Set(collectVariables(upper));

        // This logic is confusing at first. If we find a variable within the
        // function that is declared in the parent scope, we want to report it.
        // If a variable is used in the function, but not declared in the parent,
        // then it's likely a global variable such as `Promise` or `console`.
        through
          .filter((ref) => allRefs.has(ref.identifier.name))
          .forEach((ref, i, arr) => {
            const descriptor: Rule.ReportDescriptor = {
              data: { variable: ref.identifier.name },
              messageId: 'noUnsafeReference',
              node: ref.identifier,
            };

            // We only report on the first unsafe reference since fixes overlap
            if (i !== 0) {
              context.report(descriptor);
              return;
            }

            context.report({
              ...descriptor,
              fix(fixer) {
                const refs = arr.map((ref) => ref.identifier.name).join(', ');

                return [
                  addArgument(fixer, node, refs),
                  addParam(sourceCode, fixer, fn, refs),
                ].filter(truthy);
              },
            });
          });
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Prevent unsafe variable references in page.evaluate()',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-unsafe-references.md',
    },
    fixable: 'code',
    messages: {
      noUnsafeReference:
        'Unsafe reference to variable "{{ variable }}" in page.evaluate()',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
