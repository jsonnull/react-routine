// @flow
import React from 'react'
import ReactDom from 'react-dom'
import Header from './Header'
import Input from './Input'

ReactDom.render(
  <div>
    <Header />
    <Input value="type here!" />
  </div>,
  (document.getElementById('root'): any)
)
