import { expect, it } from '@jest/globals';
import { readdir } from 'node:fs/promises';
import plugin from '../../src/index';

it('has all rules', async () => {
  const files = await readdir('src/rules');
  const { rules } = plugin.configs['flat/recommended'].plugins.playwright;
  const ruleKeys = Object.keys(rules).sort();
  const fileKeys = files.map((file) => file.replace('.ts', '')).sort();

  expect(ruleKeys).toEqual(fileKeys);
});
