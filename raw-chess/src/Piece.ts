type Side =
  'black' | 
  'white'

type PieceType =
  'pawn' |
  'queen' |
  'bishop' |
  'rook' |
  'knight' | 
  'king'

type RookSide = 'kingside' | 'queenside' 

interface Piece {
  readonly type: PieceType
  readonly side: Side
} 
  
type SideCode = 'w' | 'b'

const SIDE_FROM_CODE = {
  w: 'white',
  b: 'black'
} as {
  [key in SideCode] : Side
}

//  https://stackoverflow.com/questions/44480644/string-union-to-string-array
const PRIMARY_PIECETYPES = [
  'queen',
  'rook',
  'bishop',
  'knight'
] as const 
type PrimaryPieceType = (typeof PRIMARY_PIECETYPES)[number]

const isPrimaryType = (t: PieceType): boolean => (
  (PRIMARY_PIECETYPES as readonly PieceType[]).includes(t)  
)

const PIECETYPE_NAMES = {
  pawn: {
    short: 'P',
    long: 'Pawn'
  },
  queen: {
    short: 'Q',
    long: 'Queen'
  },
  bishop: {
    short: 'B',
    long: 'Bishop'
  },
  rook: {
    short: 'R',
    long: 'Rook'
  },
  knight: {
    short: 'N',
    long: 'Knight'
  },
  king: {
    short: 'K',
    long: 'King'
  },
}

const PIECETYPE_FROM_CODE = {
  P: 'pawn',
  Q: 'queen',
  B: 'bishop',
  R: 'rook',
  N: 'knight',
  K: 'king'
}
type PieceTypeCode = keyof typeof PIECETYPE_FROM_CODE 

type PieceCode = `${SideCode}${PieceTypeCode}`


  // opponent of side, and if supplied
  // equal to type or one of the types
const isOpponent = (p: Piece | null, side: Side, type?: PieceType | PieceType[]): boolean => {
  const oppositeSide = (!!p && (p!.side !== side))
  if (!type) {
    return oppositeSide 
  }
  else if (Array.isArray(type)) {
    return oppositeSide && (type! as PieceType[]).includes(p!.type)
  }
  return oppositeSide && (p!.type === type!)  
}

  // Equal if both null,
  // otherwise, not equal if only one is,
  // otherwise, according to fields' equality
const piecesEqual = (p1: Piece | null, p2: Piece | null): boolean => (
  (!p1 && !p2) ? true : (p1?.type === p2?.type) && (p1?.side === p2?.side)
)

type PieceFormat = 'T' | 'Type' | 'sT' | 's-Type' | 'side Type'

  // 'sT' is the format parsed by pieceFromCodeString() below
const pieceToString = (p: Piece, format?: PieceFormat): string => {
  const form: PieceFormat = format ?? 'sT'
  switch (form) {
    case 'T': return PIECETYPE_NAMES[p.type].short
    case 'Type': return PIECETYPE_NAMES[p.type].long
    case 'sT': return p.side.charAt(0) + PIECETYPE_NAMES[p.type].short
    case 's-Type': return `${p.side.charAt(0)}-${PIECETYPE_NAMES[p.type].long}`
    case 'side Type': return `${p.side} ${PIECETYPE_NAMES[p.type].long}`
  }
}

const pieceFromCodeString = (s: string): Piece | undefined => {
  if (s.length === 2) {
    const sideCode = s.slice(0, 1)
    const typeCode = s.slice(1, 2)

    if (!(sideCode === 'w' || sideCode === 'b') || !Object.keys(PIECETYPE_FROM_CODE).includes(typeCode)) {
      return undefined
    }
    return {
      side: (sideCode === 'w') ? 'white' : 'black',
      type: PIECETYPE_FROM_CODE[typeCode as PieceTypeCode] as PieceType
    }
  }
  return undefined
}


const otherSide = (side: Side): Side => (
  (side === 'white') ? 'black' : 'white'
)

export { 
  type Piece as default, 
  type Side,
  type PieceType,
  type PrimaryPieceType,
  type PieceFormat,
  type PieceTypeCode,
  type PieceCode,
  type SideCode,
  type RookSide,
  PRIMARY_PIECETYPES,
  isPrimaryType,
  SIDE_FROM_CODE,
  PIECETYPE_NAMES,
  PIECETYPE_FROM_CODE,
  piecesEqual,
  pieceToString,
  isOpponent,
  otherSide,
  pieceFromCodeString 
}
