# React Routine

[![npm version](https://img.shields.io/npm/v/react-routine.svg)](https://www.npmjs.com/package/react-routine)

An alternate way to write React components, focusing on simple control flow and developer experience.

**Unstable, expect breaking changes in the near future.**

```JavaScript
const controller = function*() {
  // Wait for component to begin mounting
  yield componentWillMount()

  // Set some state
  yield setState({ title: 'React Routine' })
}

const Header = props => <h1>{props.title}</h1>

export default routine(controller)(Header)
```

## Installation

```sh
yarn add react-routine

# npm install --save react-routine
```

## Examples

 - Basic ([source](examples/))


## Documentation

 - Forthcoming, stay tuned.
