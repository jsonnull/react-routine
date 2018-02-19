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

    performCallback(name: string, result: any) {
      const eff = isEffect(this.effect, effect.CALLBACK)
      if (eff && eff.name === name) {
        this.next(eff, result)
      }
    }

    nextIf(targetType: string): mixed {
      const eff = isEffect(this.effect, targetType)
      if (eff) {
        this.next(eff)
      }
    }

    next(currentEff: ?Effect, result: ?any): mixed {
      // Nothing to be done if our generator is finished
      if (this.done) {
        return
      }

      // Perform an iteration
      const args = {
        props: this.props,
        state: this.state,
        handlers: this.handlers,
        result: undefined
      }

      if (currentEff && currentEff.type === effect.CALLBACK) {
        Object.assign(args, { result })
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
      } else if (value.type === effect.CREATE_CALLBACKS) {
        const { callbacks } = value
        for (let name in callbacks) {
          if (callbacks.hasOwnProperty(name)) {
            this.handlers[name] = effect.handler(name)
            this.handlerFunctions[name] = (...params: any) => {
              const result = callbacks[name](...params)
              this.performCallback(name, result)
            }
          }
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
