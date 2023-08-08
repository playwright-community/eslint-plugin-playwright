# `eslint-plugin-playwright` Global Settings

The plugin reads global settings from your ESLint configuration's shared data under the `playwright` key. It supports the following settings:

- `additionalAssertFunctionNames`: an array of function names to treat as assertion functions for the case of rules like `expect-expect`, which enforces the presence of at least one assertion per test case. This allows such rules to recognise custom assertion functions as valid assertions. The global setting applies to all modules. The [`expect-expect` rule accepts an option by the same name](./rules/expect-expect.md#additionalassertfunctionnames) to enable per-module configuration (.e.g, for module-specific custom assert functions).

You can configure these settings like so:

```json
{
    "settings": {
        "playwright": {
            "additionalAssertFunctionNames": ["assertCustomCondition"]
        }
    }
}
```
