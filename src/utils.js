// @flow
import type { Effect } from './effects'

// Test if an effect is currently being waited on
export function isEffect(
  current: null | Effect | Array<Effect>,
  targetType: string
): Effect | false {
  // False if there's no current effect
  if (!current) {
    return false
  }

  // Test single effect
  if (current.type === targetType) {
    return ((current: any): Effect)
  }

  // Test for an array of possible effects
  if (current instanceof Array) {
    for (let i = 0; i < current.length; i++) {
      if (current[i].type === targetType) {
        return current[i]
      }
    }
    return false
  }

  return false
}
