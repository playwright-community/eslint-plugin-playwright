import { Rule } from 'eslint';
import * as ESTree from 'estree';

const getOffset = (node: ESTree.Node) => (node.type === 'Identifier' ? 0 : 1);

/**
 * Replaces an accessor node with the given `text`.
 *
 * This ensures that fixes produce valid code when replacing both dot-based and
 * bracket-based property accessors.
 */
export function replaceAccessorFixer(
  fixer: Rule.RuleFixer,
  node: ESTree.Node,
  text: string
) {
  const [start, end] = node.range!;

  return fixer.replaceTextRange(
    [start + getOffset(node), end - getOffset(node)],
    text
  );
}
