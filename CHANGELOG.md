# Change Log

## Unreleased

### Major Changes

- `createHandler` is now `createHandlers` and takes an object of type
  `{ [name: string]: Function }`
- `next` no longer has `value` field with the array of params
- the handler's return value is stored in the `result` field on `next` object

### Patches

- Fix shouldComponentUpdate binding

## 0.0.1 (February 15, 2018)

- Initial release!

