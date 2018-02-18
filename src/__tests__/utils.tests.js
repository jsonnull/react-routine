// @flow
import * as effects from '../effects'
import { isEffect } from '../utils'

describe('isEffect utility', () => {
  it('should return false when no current effect is being waited on', () => {
    const currentEffect = null
    const effectToTest = effects.COMPONENT_DID_MOUNT
    expect(isEffect(currentEffect, effectToTest)).toBe(false)
  })

  it('should return the effect when the effect is an exact match', () => {
    const currentEffect = effects.componentDidMount()
    const effectToTest = effects.COMPONENT_DID_MOUNT
    expect(isEffect(currentEffect, effectToTest)).toEqual(currentEffect)
  })

  it('should return false when the effect is not a match', () => {
    const currentEffect = effects.componentDidMount()
    const effectToTest = effects.RENDER
    expect(isEffect(currentEffect, effectToTest)).toBe(false)
  })

  it('should return an effect when theres a match out of many', () => {
    const currentEffect = [
      effects.componentWillMount(),
      effects.componentDidMount()
    ]
    const effectToTest = effects.COMPONENT_WILL_MOUNT
    expect(isEffect(currentEffect, effectToTest)).toEqual(
      effects.componentWillMount()
    )
  })

  it('should return false when theres no matches out of many', () => {
    const currentEffect = [
      effects.componentWillMount(),
      effects.componentDidMount()
    ]
    const effectToTest = effects.RENDER
    expect(isEffect(currentEffect, effectToTest)).toBe(false)
  })
})
