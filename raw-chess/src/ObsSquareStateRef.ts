import type SquareState from './SquareState'

  // see ObsSquare comments
interface ObsSquareStateRef {
  get squareState(): SquareState
}

export { type ObsSquareStateRef as default}
