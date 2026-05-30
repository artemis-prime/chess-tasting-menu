type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8]
const RANKS_REVERSED: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1]

type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 
const FILES_REVERSED: File[] = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] 

interface Position {
  readonly rank: Rank
  readonly file: File
}

type PositionCode = `${File}${Rank}`

// Assumptions: 
// 1) row and column or based on the standard 2D layout where origin is top-left,
//    and offsets are positive.
// 2) The board is also being laid out from top-left, as is usually the case,
//    (with something like { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }).
// 
// The definition of Ranks and Files if always based on the perspective of white, therefore
// Ranks, which start from the *bottom* of the board, must be reversed. 
//
// From the point of view of black --'reverse' mode, *Files* must be reversed, 
// since 'h' is first on the left, then 'g', etc.
const layoutPositionToBoardPosition = (row: number, column: number, reverse = false): Position => {
  return reverse ? 
  {
    rank: RANKS[row],
    file: FILES_REVERSED[column]
  }
  :
  {
    rank: RANKS_REVERSED[row],
    file: FILES[column]
  }
}

const positionsEqual = (s1: Position, s2: Position): boolean => (
  !!s1 && !!s2 && (s1.file === s2.file) && (s1.rank === s2.rank)
)

const positionToString = (pos: Position): PositionCode => (
  `${pos.file}${pos.rank}`  
)

const positionFromString = (s: string | null): Position | null | undefined => {
  if (s === null) {
    return null
  }
  if (s.length === 2) {
    const f = s.slice(0, 1)
    const r = +s.slice(1, 2)

    if (!(RANKS as number[]).includes(r) || !(FILES as string[]).includes(f)) {
      return undefined
    }
    return {
      file: f as File,
      rank: r as Rank,
    }
  }
  return undefined
}

export { 
  type Position as default, 
  type Rank,
  type File,
  type PositionCode,
  RANKS,
  RANKS_REVERSED,
  FILES,
  positionsEqual, 
  positionToString,
  positionFromString,
  layoutPositionToBoardPosition
}
