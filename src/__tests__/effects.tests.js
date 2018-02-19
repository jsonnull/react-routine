// @flow
import * as effects from '../effects'

describe('effects', () => {
  it('should create a forceUpdate effect', () => {
    expect(effects.forceUpdate()).toMatchSnapshot()
  })

  it('should create a render effect', () => {
    expect(effects.render()).toMatchSnapshot()
  })

  it('should create a componentWillMount effect', () => {
    expect(effects.componentWillMount()).toMatchSnapshot()
  })

  it('should create a componentDidMount effect', () => {
    expect(effects.componentDidMount()).toMatchSnapshot()
  })

  it('should create a componentWillUnmount effect', () => {
    expect(effects.componentWillUnmount()).toMatchSnapshot()
  })

  it('should create a componentWillUpdate effect', () => {
    expect(effects.componentWillUpdate()).toMatchSnapshot()
  })

  it('should create a componentDidUpdate effect', () => {
    expect(effects.componentDidUpdate()).toMatchSnapshot()
  })

  it('should create a componentDidCatch effect', () => {
    expect(effects.componentDidCatch()).toMatchSnapshot()
  })

  /*
   * Some more complex effects
   */

  it('should create a setState effect', () => {
    const mockState = { test: 'testing' }
    expect(effects.setState(mockState)).toEqual({
      type: 'SET_STATE',
      state: mockState
    })
  })

  it('should create a shouldComponentUpdate effect', () => {
    const mockCallback = () => true
    expect(effects.shouldComponentUpdate(mockCallback)).toEqual({
      type: 'SHOULD_COMPONENT_UPDATE',
      callback: mockCallback
    })
  })

  it('should create a oneOf effect', () => {
    expect(
      effects.oneOf(
        effects.componentWillMount(),
        effects.componentWillUnmount()
      )
    ).toMatchSnapshot()
  })

  it('should create a createHandler effect', () => {
    const mockHandlers = { handlerName: () => 'test' }
    expect(effects.createHandlers(mockHandlers)).toEqual({
      type: 'CREATE_CALLBACKS',
      callbacks: mockHandlers
    })
  })

  it('should create a handler effect', () => {
    const mockHandlers = { handlerName: () => 'test' }
    expect(effects.handler('handlerName')).toEqual({
      type: 'CALLBACK',
      name: 'handlerName'
    })
  })
})
