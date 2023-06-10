import rule from '../../src/rules/prefer-to-be';
import { runRuleTester } from '../utils/rule-tester';

runRuleTester('prefer-to-be', rule, {
  valid: [
    'expect(null).toBeNull();',
    'expect(null).not.toBeNull();',
    'expect(null).toBe(1);',
    'expect(null).toBe(-1);',
    'expect(null).toBe(...1);',
    'expect(obj).toStrictEqual([ x, 1 ]);',
    'expect(obj).toStrictEqual({ x: 1 });',
    'expect(obj).not.toStrictEqual({ x: 1 });',
    'expect(value).toMatchSnapshot();',
    "expect(catchError()).toStrictEqual({ message: 'oh noes!' })",
    'expect("something");',
    'expect(token).toStrictEqual(/[abc]+/g);',
    "expect(token).toStrictEqual(new RegExp('[abc]+', 'g'));",
    'expect(value).toEqual(dedent`my string`);',
  ],
  invalid: [
    {
      code: 'expect(value).toEqual("my string");',
      output: 'expect(value).toBe("my string");',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 22, line: 1 }],
    },
    {
      code: 'expect(value).toStrictEqual("my string");',
      output: 'expect(value).toBe("my string");',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 28, line: 1 }],
    },
    {
      code: 'expect(value).toStrictEqual(1);',
      output: 'expect(value).toBe(1);',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 28, line: 1 }],
    },
    {
      code: 'expect(value).toStrictEqual(-1);',
      output: 'expect(value).toBe(-1);',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 28, line: 1 }],
    },
    {
      code: 'expect(value).toEqual(`my string`);',
      output: 'expect(value).toBe(`my string`);',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 22, line: 1 }],
    },
    {
      code: 'expect(value)["toEqual"](`my string`);',
      output: 'expect(value)["toBe"](`my string`);',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 24, line: 1 }],
    },
    {
      code: 'expect(value).toStrictEqual(`my ${string}`);',
      output: 'expect(value).toBe(`my ${string}`);',
      errors: [{ messageId: 'useToBe', column: 15, endColumn: 28, line: 1 }],
    },
    {
      code: 'expect(loadMessage()).resolves.toStrictEqual("hello world");',
      output: 'expect(loadMessage()).resolves.toBe("hello world");',
      errors: [{ messageId: 'useToBe', column: 32, endColumn: 45, line: 1 }],
    },
    {
      code: 'expect(loadMessage()).resolves["toStrictEqual"]("hello world");',
      output: 'expect(loadMessage()).resolves["toBe"]("hello world");',
      errors: [{ messageId: 'useToBe', column: 32, endColumn: 47, line: 1 }],
    },
    {
      code: 'expect(loadMessage())["resolves"].toStrictEqual("hello world");',
      output: 'expect(loadMessage())["resolves"].toBe("hello world");',
      errors: [{ messageId: 'useToBe', column: 35, endColumn: 48, line: 1 }],
    },
    {
      code: 'expect(loadMessage()).resolves.toStrictEqual(false);',
      output: 'expect(loadMessage()).resolves.toBe(false);',
      errors: [{ messageId: 'useToBe', column: 32, endColumn: 45, line: 1 }],
    },
  ],
});

runRuleTester('prefer-to-be: null', rule, {
  valid: [
    'expect(null).toBeNull();',
    'expect(null).not.toBeNull();',
    'expect(null).toBe(1);',
    'expect(obj).toStrictEqual([ x, 1 ]);',
    'expect(obj).toStrictEqual({ x: 1 });',
    'expect(obj).not.toStrictEqual({ x: 1 });',
    'expect(value).toMatchSnapshot();',
    "expect(catchError()).toStrictEqual({ message: 'oh noes!' })",
    'expect("something");',
    'expect(null).not.toEqual();',
    'expect(null).toBe();',
    'expect(null).toMatchSnapshot();',
    'expect("a string").toMatchSnapshot(null);',
    'expect("a string").not.toMatchSnapshot();',
    'expect(null).toBe',
  ],
  invalid: [
    {
      code: 'expect(null).toBe(null);',
      output: 'expect(null).toBeNull();',
      errors: [
        { messageId: 'useToBeNull', column: 14, endColumn: 18, line: 1 },
      ],
    },
    {
      code: 'expect(null).toEqual(null);',
      output: 'expect(null).toBeNull();',
      errors: [
        { messageId: 'useToBeNull', column: 14, endColumn: 21, line: 1 },
      ],
    },
    {
      code: 'expect(null).toStrictEqual(null);',
      output: 'expect(null).toBeNull();',
      errors: [
        { messageId: 'useToBeNull', column: 14, endColumn: 27, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toBe(null);',
      output: 'expect("a string").not.toBeNull();',
      errors: [
        { messageId: 'useToBeNull', column: 24, endColumn: 28, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not["toBe"](null);',
      output: 'expect("a string").not["toBeNull"]();',
      errors: [
        { messageId: 'useToBeNull', column: 24, endColumn: 30, line: 1 },
      ],
    },
    {
      code: 'expect("a string")["not"]["toBe"](null);',
      output: 'expect("a string")["not"]["toBeNull"]();',
      errors: [
        { messageId: 'useToBeNull', column: 27, endColumn: 33, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toEqual(null);',
      output: 'expect("a string").not.toBeNull();',
      errors: [
        { messageId: 'useToBeNull', column: 24, endColumn: 31, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toStrictEqual(null);',
      output: 'expect("a string").not.toBeNull();',
      errors: [
        { messageId: 'useToBeNull', column: 24, endColumn: 37, line: 1 },
      ],
    },
  ],
});

runRuleTester('prefer-to-be: undefined', rule, {
  valid: [
    'expect(undefined).toBeUndefined();',
    'expect(true).toBeDefined();',
    'expect({}).toEqual({});',
    'expect(something).toBe()',
    'expect(something).toBe(somethingElse)',
    'expect(something).toEqual(somethingElse)',
    'expect(something).not.toBe(somethingElse)',
    'expect(something).not.toEqual(somethingElse)',
    'expect(undefined).toBe',
    'expect("something");',
  ],

  invalid: [
    {
      code: 'expect(undefined).toBe(undefined);',
      output: 'expect(undefined).toBeUndefined();',
      errors: [
        { messageId: 'useToBeUndefined', column: 19, endColumn: 23, line: 1 },
      ],
    },
    {
      code: 'expect(undefined).toEqual(undefined);',
      output: 'expect(undefined).toBeUndefined();',
      errors: [
        { messageId: 'useToBeUndefined', column: 19, endColumn: 26, line: 1 },
      ],
    },
    {
      code: 'expect(undefined).toStrictEqual(undefined);',
      output: 'expect(undefined).toBeUndefined();',
      errors: [
        { messageId: 'useToBeUndefined', column: 19, endColumn: 32, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toBe(undefined);',
      output: 'expect("a string").toBeDefined();',
      errors: [
        { messageId: 'useToBeDefined', column: 24, endColumn: 28, line: 1 },
      ],
    },
    {
      code: 'expect("a string").rejects.not.toBe(undefined);',
      output: 'expect("a string").rejects.toBeDefined();',
      errors: [
        { messageId: 'useToBeDefined', column: 32, endColumn: 36, line: 1 },
      ],
    },
    {
      code: 'expect("a string").rejects.not["toBe"](undefined);',
      output: 'expect("a string").rejects["toBeDefined"]();',
      errors: [
        { messageId: 'useToBeDefined', column: 32, endColumn: 38, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toEqual(undefined);',
      output: 'expect("a string").toBeDefined();',
      errors: [
        { messageId: 'useToBeDefined', column: 24, endColumn: 31, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toStrictEqual(undefined);',
      output: 'expect("a string").toBeDefined();',
      errors: [
        { messageId: 'useToBeDefined', column: 24, endColumn: 37, line: 1 },
      ],
    },
  ],
});

runRuleTester('prefer-to-be: NaN', rule, {
  valid: [
    'expect(NaN).toBeNaN();',
    'expect(true).not.toBeNaN();',
    'expect({}).toEqual({});',
    'expect(something).toBe()',
    'expect(something).toBe(somethingElse)',
    'expect(something).toEqual(somethingElse)',
    'expect(something).not.toBe(somethingElse)',
    'expect(something).not.toEqual(somethingElse)',
    'expect(undefined).toBe',
    'expect("something");',
  ],
  invalid: [
    {
      code: 'expect(NaN).toBe(NaN);',
      output: 'expect(NaN).toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 13, endColumn: 17, line: 1 }],
    },
    {
      code: 'expect(NaN).toEqual(NaN);',
      output: 'expect(NaN).toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 13, endColumn: 20, line: 1 }],
    },
    {
      code: 'expect(NaN).toStrictEqual(NaN);',
      output: 'expect(NaN).toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 13, endColumn: 26, line: 1 }],
    },
    {
      code: 'expect("a string").not.toBe(NaN);',
      output: 'expect("a string").not.toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 24, endColumn: 28, line: 1 }],
    },
    {
      code: 'expect("a string").rejects.not.toBe(NaN);',
      output: 'expect("a string").rejects.not.toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 32, endColumn: 36, line: 1 }],
    },
    {
      code: 'expect("a string")["rejects"].not.toBe(NaN);',
      output: 'expect("a string")["rejects"].not.toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 35, endColumn: 39, line: 1 }],
    },
    {
      code: 'expect("a string").not.toEqual(NaN);',
      output: 'expect("a string").not.toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 24, endColumn: 31, line: 1 }],
    },
    {
      code: 'expect("a string").not.toStrictEqual(NaN);',
      output: 'expect("a string").not.toBeNaN();',
      errors: [{ messageId: 'useToBeNaN', column: 24, endColumn: 37, line: 1 }],
    },
  ],
});

runRuleTester('prefer-to-be: undefined vs defined', rule, {
  valid: [
    'expect(NaN).toBeNaN();',
    'expect(true).not.toBeNaN();',
    'expect({}).toEqual({});',
    'expect(something).toBe()',
    'expect(something).toBe(somethingElse)',
    'expect(something).toEqual(somethingElse)',
    'expect(something).not.toBe(somethingElse)',
    'expect(something).not.toEqual(somethingElse)',
    'expect(undefined).toBe',
    'expect("something");',
  ],
  invalid: [
    {
      code: 'expect(undefined).not.toBeDefined();',
      output: 'expect(undefined).toBeUndefined();',
      errors: [
        { messageId: 'useToBeUndefined', column: 23, endColumn: 34, line: 1 },
      ],
    },
    {
      code: 'expect(undefined).resolves.not.toBeDefined();',
      output: 'expect(undefined).resolves.toBeUndefined();',
      errors: [
        { messageId: 'useToBeUndefined', column: 32, endColumn: 43, line: 1 },
      ],
    },
    {
      code: 'expect(undefined).resolves.toBe(undefined);',
      output: 'expect(undefined).resolves.toBeUndefined();',
      errors: [
        { messageId: 'useToBeUndefined', column: 28, endColumn: 32, line: 1 },
      ],
    },
    {
      code: 'expect("a string").not.toBeUndefined();',
      output: 'expect("a string").toBeDefined();',
      errors: [
        { messageId: 'useToBeDefined', column: 24, endColumn: 37, line: 1 },
      ],
    },
    {
      code: 'expect("a string").rejects.not.toBeUndefined();',
      output: 'expect("a string").rejects.toBeDefined();',
      errors: [
        { messageId: 'useToBeDefined', column: 32, endColumn: 45, line: 1 },
      ],
    },
  ],
});
