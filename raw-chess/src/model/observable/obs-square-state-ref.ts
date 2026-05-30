import type SquareState from '../square-state'

  // see ObsSquare comments
interface ObsSquareStateRef {
  get squareState(): SquareState
}

export { type ObsSquareStateRef as default}
