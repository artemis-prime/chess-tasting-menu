import type Piece from './Piece'

// see ObsSquare comments
interface ObsPieceRef {
  get piece(): Piece | null
}

export { type ObsPieceRef as default}
