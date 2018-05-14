// @flow
import React from 'react'
import ReactDom from 'react-dom'
import {
  routine,
  setState,
  componentWillMount,
  createHandlers
} from '../dist/react-routine.umd'

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

const Component = props => (
  <div>
    <h1>{props.value}</h1>
    <input value={props.value} onChange={props.onChange} />
  </div>
)

const EnhancedComponent = routine(controller)(Component)

ReactDom.render(
  <EnhancedComponent value="React Routine" />,
  (document.getElementById('root'): any)
)
