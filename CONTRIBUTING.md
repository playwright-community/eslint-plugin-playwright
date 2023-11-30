# Contributing

## Installing Dependencies

We use [pnpm](https://pnpm.io) for managing dependencies. You can install the
necessary dependencies using the following command:

```bash
pnpm install
```

## Running Tests

When making changes to lint rules, you can re-run the tests with the following
command:

```bash
pnpm test
```

Or run it in watch mode like so:

```bash
pnpm test -- --watch
```

## Adding new rules

When adding new rules, make sure to follow these steps:

1. Add the rule source code in `src/rules`
1. Add tests for the rule in `test/spec`
1. Add docs for the rule to `docs/rules`
1. Add a short description of the rule in `README.md`

## Releasing

To release a new version with semantic-release, run the following command.

```bash
gh workflow run release.yml
```
