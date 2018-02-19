import React from 'react'
import {
  routine,
  setState,
  componentWillMount,
  createHandlers
} from '../../dist/react-routine'

const controller = function*() {
  // Get the initial props
  const initial = yield componentWillMount()

  // Set the initial state
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

const Input = props => <input value={props.value} onChange={props.onChange} />

export default routine(controller)(Input)
