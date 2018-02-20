# React Routine

[![Build Status](https://travis-ci.org/jsonnull/react-routine.svg?branch=master)](https://travis-ci.org/jsonnull/react-routine)
[![Coverage Status](https://coveralls.io/repos/github/jsonnull/react-routine/badge.svg?branch=master)](https://coveralls.io/github/jsonnull/react-routine?branch=master)
[![npm version](https://img.shields.io/npm/v/react-routine.svg)](https://www.npmjs.com/package/react-routine)

An alternate way to write React components, focusing on simple control flow and developer experience.

**Unstable, expect breaking changes in the near future.**

```JavaScript
import React from 'react'
import { routine, setState, componentWillMount, createHandlers } from 'react-routine'

const controller = function*() {
  // Get the initial props
  const initial = yield componentWillMount()

  // Set the initial sate
  yield setState({ value: initial.props.value })

  // Create a change handler we can listen to
  const { handlers } = yield createHandlers({ onChange: e => e.target.value })

  while (true) {
    // Wait for change handler
    const { result } = yield handlers.onChange
    // Set the new state
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

## Documentation

 - [Getting Started](docs/getting-started.md)

## Examples

 - Basic ([source](examples/))
