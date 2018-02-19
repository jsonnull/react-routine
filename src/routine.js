// @flow
import * as React from 'react'
import type { Effect } from './effects'
import { isEffect } from './utils'
import * as effect from './effects'

type Routine = Generator<Effect, *, *>

const routine = (gen: () => Routine) => (
  WrappedComponent: React.ComponentType<any>,
  mergeProps: ?Function
): React.ComponentType<any> => {
  return class extends React.Component<*, *> {
    routine: Routine
    effect: null | Effect | Array<Effect>
    done: boolean
    handlers: { [string]: Effect }
    handlerFunctions: { [string]: Function }

    constructor() {
      super()

      this.effect = null
      this.done = false
      this.handlers = {}
      this.handlerFunctions = {}

      // Start the routine
      this.routine = gen()
      this.next()
    }

    componentWillMount() {
      this.nextIf(effect.COMPONENT_WILL_MOUNT)
    }

    componentDidMount() {
      this.nextIf(effect.COMPONENT_DID_MOUNT)
    }

    componentWillUnmount() {
      this.nextIf(effect.COMPONENT_WILL_UNMOUNT)
    }

    componentWillUpdate() {
      this.nextIf(effect.COMPONENT_WILL_UPDATE)
    }

    componentDidUpdate() {
      this.nextIf(effect.COMPONENT_DID_UPDATE)
    }

    componentDidCatch() {
      this.nextIf(effect.COMPONENT_DID_CATCH)
    }

    performCallback(name: string, params: any) {
      const eff = isEffect(this.effect, effect.CALLBACK)
      if (eff && eff.name === name) {
        this.next(eff, params)
      }
    }

    nextIf(targetType: string): mixed {
      const eff = isEffect(this.effect, targetType)
      if (eff) {
        this.next(eff)
      }
    }

    next(currentEff: ?Effect, params: ?any): mixed {
      // Nothing to be done if our generator is finished
      if (this.done) {
        return
      }

      // Perform an iteration
      const args = {
        props: this.props,
        state: this.state,
        handlers: this.handlers,
        value: null
      }
      if (currentEff && currentEff.type == effect.CALLBACK) {
        Object.assign(args, { value: params })
      }
      const { done, value } = this.routine.next(args)
      this.done = done

      // Required for flow to work with generators
      if (value === undefined) {
        return
      }

      // Store the effect for listeners
      this.effect = value

      if (value.type === effect.SET_STATE) {
        this.setState(value.state)
        this.next(value)
      } else if (value.type === effect.FORCE_UPDATE) {
        this.forceUpdate()
        this.next(value)
      } else if (value.type === effect.SHOULD_COMPONENT_UPDATE) {
        // $FlowFixMe: re-binding SCU on-the-fly considered harmful?
        this.shouldComponentUpdate = value.callback.bind(this)
        this.next(value)
      } else if (value.type === effect.CREATE_CALLBACK) {
        const name = value.name
        // Create the callback
        this.handlers[name] = effect.handler(name)
        this.handlerFunctions[name] = (...params: any) => {
          this.performCallback(name, params)
        }
        this.next(value)
      }
    }

    render() {
      const eff = isEffect(this.effect, effect.RENDER)
      if (eff) {
        this.next(eff)
      }

      const state = this.state || {}
      const props = mergeProps
        ? mergeProps(this.props, state, this.handlerFunctions)
        : defaultMergeProps(this.props, state, this.handlerFunctions)

      return <WrappedComponent {...props} />
    }
  }
}

function defaultMergeProps(
  props: Object,
  state: Object,
  handlers: Object
): Object {
  return { ...props, ...state, ...handlers }
}

export default routine
