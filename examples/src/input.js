import React from 'react'
import {
  routine,
  setState,
  componentWillMount,
  createHandler
} from '../../dist/react-routine'

const controller = function*() {
  // Get the initial props
  const initial = yield componentWillMount()

  // Set the initial state
  yield setState({ value: initial.props.value })

  // Create a change handler we can listen to
  const { handlers } = yield createHandler('onChange')

  while (true) {
    // Wait for change handler
    const result = yield handlers.onChange
    // Pull out the event from the handler
    const [event] = result.value
    // Set the new state
    yield setState({ value: event.target.value })
  }
}

const Input = props => <input value={props.value} onChange={props.onChange} />

export default routine(controller)(Input)
