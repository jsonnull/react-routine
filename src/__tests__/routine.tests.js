// @flow
import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import * as effects from '../effects'
import routine from '../routine'

Enzyme.configure({ adapter: new Adapter() })

describe('routine HOC factory', () => {
  const render = () => <div className="render">test render</div>

  it('should render with an empty generator', () => {
    const Empty = routine(function*() {})(render)

    // Rendering should be completed correctly
    const wrapper = shallow(<Empty />)
    expect(wrapper.find('render')).toHaveLength(1)

    // The instance should understand it is done
    const instance = wrapper.instance()
    expect(instance.done).toBe(true)
  })

  it('should be able to set state', () => {
    const SetState = routine(function*() {
      yield effects.componentWillMount()
      yield effects.setState({ test: 'test value' })
    })(render)

    // Rendering should be completed correctly
    const wrapper = shallow(<SetState />)
    expect(wrapper.state('test')).toEqual('test value')
  })

  it('should create and respond to handler functions', () => {
    const callback = sinon.spy(() => 'test return')
    const Handler = routine(function*() {
      const { handlers } = yield effects.createHandlers({ test: callback })
      const { result } = yield handlers.test
      yield effects.setState({ value: result })
    })(render)

    // Initial render completes
    const wrapper = shallow(<Handler />)
    expect(wrapper.find('render')).toHaveLength(1)

    const instance = wrapper.instance()

    // Wrapper is waiting for the callback
    expect(instance.done).toBe(false)
    expect(instance.effect).toHaveProperty('type', effects.CALLBACK)

    // Callback exists
    expect(instance.handlers).toHaveProperty('test')
    expect(instance.handlerFunctions).toHaveProperty('test')

    // Firing callback should continue generator
    const fn = instance.handlerFunctions.test
    fn()
    expect(instance.done).toBe(true)
    expect(callback.called).toBe(true)
    expect(wrapper.state()).toEqual({ value: 'test return' })
  })

  it('should respond to lifecycle methods', () => {
    const callback = sinon.spy(() => 'test return')

    const Lifecycles = routine(function*() {
      yield effects.componentWillMount()
      yield effects.render()
      yield effects.componentDidMount()
      // yield effects.componentWillReceiveProps()
      yield effects.componentWillUpdate()
      yield effects.render()
      yield effects.componentDidUpdate()
    })(render)

    // Initial render completes
    const wrapper = mount(<Lifecycles />)
    expect(wrapper.find('div.render')).toHaveLength(1)

    const instance = wrapper.instance()

    // Wrapper is waiting for the callback
    expect(instance.done).toBe(false)
    expect(instance.effect).toHaveProperty(
      'type',
      effects.COMPONENT_WILL_UPDATE
    )

    // Setting new props triggers the update methods
    wrapper.setProps({ test: 'test prop' })
    expect(instance.done).toBe(true)
  })
})
