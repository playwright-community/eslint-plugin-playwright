import { readdir } from 'node:fs/promises';
import { expect, test } from 'vitest';
import plugin from '../../src/index';

test('has all rules', async () => {
  const files = await readdir('src/rules');
  const { rules } = plugin.configs['flat/recommended'].plugins.playwright;
  const ruleKeys = Object.keys(rules).sort();
  const fileKeys = files.map((file) => file.replace('.ts', '')).sort();

  expect(ruleKeys).toEqual(fileKeys);
});
