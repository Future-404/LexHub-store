import assert from 'node:assert/strict';
import test from 'node:test';
import { validateRegistry } from './validate-index.mjs';

const validModule = {
  id: 'example',
  name: 'Example',
  version: '1.0.0',
  author: 'Example Team',
  description: 'Example module',
  platforms: ['termux'],
  platform_requirements: {
    termux: {
      architectures: ['arm64'],
      min_android_api: 24
    }
  },
  repo_url: 'https://github.com/example/example.git',
  branch: 'main'
};

test('accepts explicit Termux constraints', () => {
  assert.deepEqual(validateRegistry([validModule]), []);
});

test('rejects duplicate module identities', () => {
  assert.match(validateRegistry([validModule, validModule]).join('\n'), /duplicate id example/);
});

test('rejects invalid Termux constraints', () => {
  const invalidModule = {
    ...validModule,
    platform_requirements: {
      termux: {
        architectures: ['aarch64'],
        min_android_api: 0
      }
    }
  };
  const errors = validateRegistry([invalidModule]).join('\n');
  assert.match(errors, /unsupported architecture aarch64/);
  assert.match(errors, /min_android_api must be a positive integer/);
});

test('rejects malformed registry entries without crashing', () => {
  assert.match(validateRegistry([null]).join('\n'), /module must be an object/);
});
