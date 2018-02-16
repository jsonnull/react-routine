import React from 'react'
import { routine, setState, componentWillMount } from '../../dist/react-routine'

const Header = props => {
  return <h1>{props.title}</h1>
}

const controller = function*() {
  // Wait for component to mount
  yield componentWillMount()

  // Set the state
  yield setState({ title: 'React Routine' })
}

export default routine(controller)(Header)
