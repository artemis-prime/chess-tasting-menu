import type Piece from '../piece'

// see ObsSquare comments
interface ObsPieceRef {
  get piece(): Piece | null
}

export { type ObsPieceRef as default}
