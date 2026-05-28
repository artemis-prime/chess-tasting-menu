interface CastlingTracking {
  hasCastled: boolean
  kingMoveCount: number
  rookMoveCounts: {
    kingside: number
    queenside: number
  } 
}

export { type CastlingTracking as default }