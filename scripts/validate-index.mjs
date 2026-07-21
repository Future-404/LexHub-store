import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const allowedPlatforms = new Set(['linux', 'windows', 'termux']);
const allowedArchitectures = new Set(['arm', 'arm64', 'ia32', 'x64']);

export function validateRegistry(modules) {
  const errors = [];
  const ids = new Set();

  if (!Array.isArray(modules)) return ['index.json must contain an array'];

  for (const [position, module] of modules.entries()) {
    const label = `entry ${position + 1}`;
    if (module === null || typeof module !== 'object' || Array.isArray(module)) {
      errors.push(`${label}: module must be an object`);
      continue;
    }
    for (const field of ['id', 'name', 'version', 'author', 'description', 'repo_url', 'branch']) {
      if (typeof module[field] !== 'string' || module[field].trim() === '') {
        errors.push(`${label}: ${field} must be a non-empty string`);
      }
    }

    if (ids.has(module.id)) errors.push(`${label}: duplicate id ${module.id}`);
    ids.add(module.id);

    if (!Array.isArray(module.platforms) || module.platforms.length === 0) {
      errors.push(`${label}: platforms must be a non-empty array`);
      continue;
    }

    for (const platform of module.platforms) {
      if (!allowedPlatforms.has(platform)) errors.push(`${label}: unsupported platform ${platform}`);
    }

    for (const [platform, requirements] of Object.entries(module.platform_requirements ?? {})) {
      if (!module.platforms.includes(platform)) {
        errors.push(`${label}: requirements declared for unsupported platform ${platform}`);
      }
      if (requirements === null || typeof requirements !== 'object' || Array.isArray(requirements)) {
        errors.push(`${label}: ${platform} requirements must be an object`);
        continue;
      }
      if (!Array.isArray(requirements.architectures) || requirements.architectures.length === 0) {
        errors.push(`${label}: ${platform} architectures must be a non-empty array`);
      } else {
        for (const architecture of requirements.architectures) {
          if (!allowedArchitectures.has(architecture)) {
            errors.push(`${label}: unsupported architecture ${architecture}`);
          }
        }
      }
      if (requirements.min_android_api !== undefined &&
          (!Number.isInteger(requirements.min_android_api) || requirements.min_android_api < 1)) {
        errors.push(`${label}: min_android_api must be a positive integer`);
      }
    }
  }

  return errors;
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  const modules = JSON.parse(await readFile(new URL('../index.json', import.meta.url), 'utf8'));
  const errors = validateRegistry(modules);
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${modules.length} registry entries.`);
  }
}
