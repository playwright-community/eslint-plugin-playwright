import { Rule } from 'eslint';
import * as ESTree from 'estree';
import {
  getParent,
  getStringValue,
  isIdentifier,
  isStringNode,
  StringNode,
  testHooks,
} from './ast';

const VALID_CHAINS = new Set([
  // Hooks
  'afterAll',
  'afterEach',
  'beforeAll',
  'beforeEach',
  'test.afterAll',
  'test.afterEach',
  'test.beforeAll',
  'test.beforeEach',
  // Describe
  'describe',
  'describe.only',
  'describe.skip',
  'describe.fixme',
  'describe.configure',
  'test.describe',
  'test.describe.only',
  'test.describe.skip',
  'test.describe.fixme',
  'test.describe.configure',
  // Test
  'test',
  'test.fail',
  'text.fixme',
  'test.only',
  'test.skip',
  'test.slow',
  'test.step',
  'test.use',
]);

export type AccessorNode = StringNode | ESTree.Identifier;

const joinChains = (
  a: AccessorNode[] | null,
  b: AccessorNode[] | null,
): AccessorNode[] | null => (a && b ? [...a, ...b] : null);

/**
 * Checks if the given `node` is a "supported accessor".
 *
 * This means that it's a node can be used to access properties, and who's
 * "value" can be statically determined.
 *
 * `MemberExpression` nodes most commonly contain accessors, but it's possible
 * for other nodes to contain them.
 *
 * If a `value` is provided & the `node` is an `AccessorNode`, the `value` will
 * be compared to that of the `AccessorNode`.
 *
 * Note that `value` here refers to the normalised value. The property that
 * holds the value is not always called `name`.
 */
const isSupportedAccessor = (
  node: ESTree.Node,
  value?: string,
): node is AccessorNode =>
  isIdentifier(node, value) || isStringNode(node, value);

function getNodeChain(node: ESTree.Node): AccessorNode[] | null {
  if (isSupportedAccessor(node)) {
    return [node];
  }

  switch (node.type) {
    case 'TaggedTemplateExpression':
      return getNodeChain(node.tag);
    case 'MemberExpression':
      return joinChains(getNodeChain(node.object), getNodeChain(node.property));
    case 'CallExpression':
      return getNodeChain(node.callee);
  }

  return null;
}

const resolvePossibleAliasedGlobal = (
  context: Rule.RuleContext,
  global: string,
) => {
  const globalAliases: Record<string, string[]> =
    context.settings.playwright?.globalAliases ?? {};

  const alias = Object.entries(globalAliases).find(([, aliases]) =>
    aliases.includes(global),
  );

  return alias?.[0] ?? null;
};

interface ResolvedFn {
  local: string;
  original: string | null;
  type: 'global' | 'import';
}

const resolveToPlaywrightFn = (
  context: Rule.RuleContext,
  accessor: AccessorNode,
): ResolvedFn | null => {
  const ident = getStringValue(accessor);

  // TODO: Automatic import detection

  return {
    local: ident,
    original: resolvePossibleAliasedGlobal(context, ident),
    type: 'global',
  };
};

export type FnType = 'describe' | 'expect' | 'hook' | 'test' | 'unknown';

function determinePlaywrightFnType(name: string): FnType {
  if (name === 'expect') return 'expect';
  if (name === 'describe') return 'describe';
  if (name === 'test') return 'test';
  if (testHooks.has(name)) return 'hook';
  return 'unknown';
}

type KnownMemberExpression = ESTree.MemberExpression & {
  parent: ESTree.CallExpression;
};

type KnownMemberExpressionProperty = AccessorNode & {
  parent: KnownMemberExpression;
};

export interface ResolvedFnWithNode extends ResolvedFn {
  node: AccessorNode;
}

interface BaseParsedFnCall {
  head: ResolvedFnWithNode;
  members: KnownMemberExpressionProperty[];
  /**
   * The name of the underlying Playwright function that is being called. This
   * is the result of `(head.original ?? head.local)`.
   */
  name: string;
  type: FnType;
}

interface ParsedGeneralFnCall extends BaseParsedFnCall {
  type: Exclude<FnType, 'expect'>;
}

interface ModifiersAndMatcher {
  args: ESTree.CallExpression['arguments'];
  matcher: KnownMemberExpressionProperty;
  modifiers: KnownMemberExpressionProperty[];
}

export interface ParsedExpectFnCall
  extends BaseParsedFnCall,
    ModifiersAndMatcher {
  type: 'expect';
}

export type ParsedFnCall = ParsedGeneralFnCall | ParsedExpectFnCall;

export function parseFnCall(
  context: Rule.RuleContext,
  node: ESTree.CallExpression,
) {
  const chain = getNodeChain(node);

  if (!chain?.length) {
    return null;
  }

  const [first, ...rest] = chain;
  const resolved = resolveToPlaywrightFn(context, first);
  if (!resolved) return null;

  let name = resolved.original ?? resolved.local;
  const links = [name, ...rest.map((link) => getStringValue(link))];

  if (name !== 'expect' && !VALID_CHAINS.has(links.join('.'))) {
    return null;
  }

  // To support Playwright's convention of `test.describe`, `test.beforeEach`,
  // etc. we need to test the second link in the chain to find the true type.
  if (name === 'test' && links.length > 1) {
    const nextLinkName = links[1];
    const nextLinkType = determinePlaywrightFnType(nextLinkName);

    if (nextLinkType !== 'unknown') {
      name = nextLinkName;
    }
  }

  const parsedFnCall: Omit<ParsedFnCall, 'type'> = {
    head: { ...resolved, node: first },
    // every member node must have a member expression as their parent
    // in order to be part of the call chain we're parsing
    members: rest as KnownMemberExpressionProperty[],
    name,
  };

  const type = determinePlaywrightFnType(name);

  if (type === 'expect') {
    // const result = parseExpectCall(parsedFnCall);
    //
    // // if the `expect` call chain is not valid, only report on the topmost node
    // // since all members in the chain are likely to get flagged for some reason
    // if (
    //   typeof result === 'string' &&
    //   findTopMostCallExpression(node) !== node
    // ) {
    //   return null;
    // }
    //
    // if (result === 'matcher-not-found') {
    //   if (node.parent?.type === 'MemberExpression') {
    //     return 'matcher-not-called';
    //   }
    // }
    //
    // return result;
    return {
      ...parsedFnCall,
      args: [],
      matcher: rest[rest.length - 1],
      modifiers: rest.slice(0, rest.length - 1),
      type,
    };
  }

  // Check that every link in the chain except the last is a member expression
  if (
    chain
      .slice(0, chain.length - 1)
      .some((n) => getParent(n)?.type !== 'MemberExpression')
  ) {
    return null;
  }

  // Ensure that we're at the "top" of the function call chain otherwise when
  // parsing e.g. x().y.z(), we'll incorrectly find & parse "x()" even though
  // the full chain is not a valid Playwright function call chain
  const parent = getParent(node);
  if (
    parent?.type === 'CallExpression' ||
    parent?.type === 'MemberExpression'
  ) {
    return null;
  }

  return { ...parsedFnCall, type };
}

export const isTypeOfFnCall = (
  context: Rule.RuleContext,
  node: ESTree.CallExpression,
  types: FnType[],
): boolean => {
  const call = parseFnCall(context, node);
  return call !== null && types.includes(call.type);
};
