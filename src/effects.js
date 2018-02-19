// @flow

export type Effect =
  | { type: 'SET_STATE', state: Object }
  | { type: 'FORCE_UPDATE' }
  | { type: 'RENDER' }
  | { type: 'COMPONENT_WILL_MOUNT' }
  | { type: 'COMPONENT_DID_MOUNT' }
  | { type: 'COMPONENT_WILL_UNMOUNT' }
  | { type: 'SHOULD_COMPONENT_UPDATE', callback: () => boolean }
  | { type: 'COMPONENT_WILL_UPDATE' }
  | { type: 'COMPONENT_DID_UPDATE' }
  | { type: 'COMPONENT_DID_CATCH' }
  | { type: 'CALLBACK', name: string }
  | { type: 'CREATE_CALLBACKS', callbacks: { [name: string]: Function } }

export const SET_STATE = 'SET_STATE'
export const FORCE_UPDATE = 'FORCE_UPDATE'
export const RENDER = 'RENDER'
export const COMPONENT_WILL_MOUNT = 'COMPONENT_WILL_MOUNT'
export const COMPONENT_DID_MOUNT = 'COMPONENT_DID_MOUNT'
export const COMPONENT_WILL_UNMOUNT = 'COMPONENT_WILL_UNMOUNT'
export const SHOULD_COMPONENT_UPDATE = 'SHOULD_COMPONENT_UPDATE'
export const COMPONENT_WILL_UPDATE = 'COMPONENT_WILL_UPDATE'
export const COMPONENT_DID_UPDATE = 'COMPONENT_DID_UPDATE'
export const COMPONENT_DID_CATCH = 'COMPONENT_DID_CATCH'
export const CALLBACK = 'CALLBACK'
export const CREATE_CALLBACKS = 'CREATE_CALLBACKS'

export const setState = (state: Object) => ({
  type: SET_STATE,
  state: state
})

export const forceUpdate = () => ({
  type: FORCE_UPDATE
})

export const render = () => ({
  type: RENDER
})

export const componentWillMount = () => ({
  type: COMPONENT_WILL_MOUNT
})

export const componentDidMount = () => ({
  type: COMPONENT_DID_MOUNT
})

export const componentWillUnmount = () => ({
  type: COMPONENT_WILL_UNMOUNT
})

export const shouldComponentUpdate = (callback: () => boolean) => ({
  type: SHOULD_COMPONENT_UPDATE,
  callback
})

export const componentWillUpdate = () => ({
  type: COMPONENT_WILL_UPDATE
})

export const componentDidUpdate = () => ({
  type: COMPONENT_DID_UPDATE
})

export const componentDidCatch = () => ({
  type: COMPONENT_DID_CATCH
})

export const oneOf = (...args: Array<Effect>) => args

export const createHandlers = (callbacks: { [name: string]: Function }) => ({
  type: CREATE_CALLBACKS,
  callbacks
})

export const handler = (name: string) => ({
  type: CALLBACK,
  name
})
