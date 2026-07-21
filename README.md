# LexHub Store Registry

This repository acts as the central registry for LexHub modules. It contains the official module index and catalog metadata.

## Structure

* `index.json`: The main module catalog registry containing details of all available modules.
* `scripts/validate-index.mjs`: Registry contract checks used locally and in CI.

## Platform compatibility

`platforms` declares the supported operating-system families. Modules with narrower
runtime support must also declare `platform_requirements`:

```json
{
  "platforms": ["linux", "termux"],
  "platform_requirements": {
    "termux": {
      "architectures": ["arm64"],
      "min_android_api": 24
    }
  }
}
```

Catalog consumers must enforce these requirements before installation. Architecture
names follow Node.js `process.arch` values.

## Validation

```sh
node scripts/validate-index.mjs
```
