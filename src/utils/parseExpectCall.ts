import { Rule } from 'eslint';
import { isExpectCall, getMatchers, getStringValue } from './ast';
import * as ESTree from 'estree';

const MODIFIER_NAMES = new Set(['not', 'resolves', 'rejects']);

function getExpectArguments(node: Rule.Node): ESTree.Node[] {
  const grandparent = node.parent.parent;
  return grandparent.type === 'CallExpression' ? grandparent.arguments : [];
}

export interface ParsedExpectCall {
  matcherName: string;
  matcher: ESTree.Node;
  modifiers: ESTree.Node[];
  args: ESTree.Node[];
}

export function parseExpectCall(
  node: ESTree.CallExpression & Rule.NodeParentExtension
): ParsedExpectCall | undefined {
  if (!isExpectCall(node)) {
    return;
  }

  const modifiers: ESTree.Node[] = [];
  let matcher: Rule.Node | undefined;

  // Separate the matchers (e.g. toBe) from modifiers (e.g. not)
  getMatchers(node).forEach((item) => {
    if (MODIFIER_NAMES.has(getStringValue(item))) {
      modifiers.push(item);
    } else {
      matcher = item;
    }
  });

  // Rules only run against full expect calls with matchers
  if (!matcher) {
    return;
  }

  return {
    matcherName: getStringValue(matcher),
    matcher,
    args: getExpectArguments(matcher),
    modifiers,
  };
}
