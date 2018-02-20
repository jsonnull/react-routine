# React Routine

[![Build Status](https://travis-ci.org/jsonnull/react-routine.svg?branch=master)](https://travis-ci.org/jsonnull/react-routine)
[![Coverage Status](https://coveralls.io/repos/github/jsonnull/react-routine/badge.svg?branch=master)](https://coveralls.io/github/jsonnull/react-routine?branch=master)
[![npm version](https://img.shields.io/npm/v/react-routine.svg)](https://www.npmjs.com/package/react-routine)

An alternate way to write React components, focusing on simple control flow and developer experience.

**Unstable, expect breaking changes in the near future.**

```JavaScript
import React from 'react'
import { routine, setState, componentWillMount, createHandlers } from 'react-routine'

// A simple controlled input
const controller = function*() {
  // Wait for initial mount before setting state
  const initial = yield componentWillMount()

  // Copy `value` prop into state
  yield setState({ value: initial.props.value })

  // Create a callback function which returns an input value
  const { handlers } = yield createHandlers({ onChange: e => e.target.value })

  // Create an event loop
  while (true) {
    // Any time our callback is called...
    const { result } = yield handlers.onChange
    // ...update the value in state
    yield setState({ value: result })
  }
}

const Input = props => <input onChange={props.onChange} value={props.value} />

export default routine(controller)(Input)
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
