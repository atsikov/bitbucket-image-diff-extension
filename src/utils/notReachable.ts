export function throwNotReachable(value: never): never {
  throw new Error(`Should not be reachable: ${value}`)
}
