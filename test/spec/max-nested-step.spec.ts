import { runRuleTester } from '../utils/rule-tester';
import rule from '../../src/rules/max-nested-step';
import dedent = require('dedent');

const messageId = 'exceededMaxDepth';

runRuleTester('max-nested-step', rule, {
  valid: [
    'await test.step("step1", () => {});',
    'await test.step("step1", async () => {});',
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("step2", async () => {
            await test.step("step3", async () => {
              await test.step("step4", async () => {
                await test.step("step5", async () => {
                  await expect(true).toBe(true);
                });
              });
            });
          });
        });
      });
      `,
    },
    {
      code: dedent`
        test('foo', async () => {
          await expect(true).toBe(true);
        });
      `,
      options: [{ max: 0 }],
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await expect(true).toBe(true);
          });
        });
      `,
      options: [{ max: 1 }],
    },
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("step2", async () => {
            await expect(true).toBe(true);
          });
        });
      });
      `,
      options: [{ max: 2 }],
    },
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("step2", async () => {
            await test.step("step3", async () => {
              await expect(true).toBe(true);
            });
          });
        });
      });
      `,
      options: [{ max: 3 }],
    },
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("step2", async () => {
            await test.step("step3", async () => {
              await test.step("step4", async () => {
                await expect(true).toBe(true);
              });
            });
          });
        });
      });
      `,
      options: [{ max: 4 }],
    },
  ],
  invalid: [
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("step2", async () => {
            await test.step("step3", async () => {
              await test.step("step4", async () => {
                await test.step("step5", async () => {
                  await test.step("step6", async () => {
                    await expect(true).toBe(true);
                  });
                });
              });
            });
          });
        });
      });
      `,
      errors: [{ messageId, line: 6, column: 11, endLine: 6, endColumn: 24 }],
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1 over", async () => {
            await expect(true).toBe(true);
          });
        });
      `,
      errors: [{ messageId, line: 1, column: 1, endLine: 1, endColumn: 14 }],
      options: [{ max: 0 }],
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await test.step("step2 over", async () => {
              await expect(true).toBe(true);
            });
          });
        });
      `,
      errors: [{ messageId, line: 1, column: 1, endLine: 1, endColumn: 14 }],
      options: [{ max: 1 }],
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await test.step("step2", async () => {
              await test.step("step3 over", async () => {
                await expect(true).toBe(true);
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 3, endColumn: 18 }],
      options: [{ max: 2 }],
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await test.step("step2", async () => {
              await test.step("step3", async () => {
                await test.step("step4 over", async () => {
                  await expect(true).toBe(true);
                });
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 3, endColumn: 18 }],
      options: [{ max: 3 }],
    },
    {
      code: dedent`
        test('foo', async () => {
          await test.step("step1", async () => {
            await test.step("step2", async () => {
              await test.step("step3", async () => {
                await test.step("step4", async () => {
                  await test.step("step5 over", async () => {
                      await expect(true).toBe(true);
                  });
                });
              });
            });
          });
        });
      `,
      errors: [{ messageId, line: 3, column: 5, endLine: 3, endColumn: 18 }],
      options: [{ max: 4 }],
    },
    {
      code: dedent`
      test('foo', async () => {
        await test.step("step1", async () => {
          await test.step("step2", async () => {
            await test.step("step3", async () => {
              await test.step("step4", async () => {
                await test.step("step5", async () => {
                  await test.step("step6 over", async () => {
                    await expect(true).toBe(true);
                  });
                  await test.step("step6 over", async () => {
                    await expect(true).toBe(true);
                  });
                });
              });
            });
          });
        });
      });
      `,
      options: [{ max: 5 }],
      errors: [
        { messageId, line: 6, column: 11, endLine: 6, endColumn: 27 },
        { messageId, line: 12, column: 11, endLine: 12, endColumn: 24 },
      ],
    },
  ],
});
