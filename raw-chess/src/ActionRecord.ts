import type Action from './Action'
import type Move from './Move'
import type Piece from './Piece'
import { 
  pieceToString, 
  pieceFromCodeString,
  PIECETYPE_NAMES,
  PIECETYPE_FROM_CODE, 
  type PieceTypeCode,
  type PieceType,
  type PieceFormat,
  otherSide
} from './Piece'
import { positionToString, positionFromString } from './Position'

type AnnotatedResult =  'checkmate' | 'stalemate' |  'check'

const ANNOTATION_FROM_RESULT = {
  check: '+',
  checkmate: '#',
  stalemate: '==',
} as {[key in AnnotatedResult]: string}

const ANNOTATIONS = Object.values(ANNOTATION_FROM_RESULT)
const ANNOTATEDRESULTS = Object.keys(ANNOTATION_FROM_RESULT) as AnnotatedResult[]

type ActionMode = 'do' | 'undo' | 'redo'

  // Use to record a change of state.
  // Must contain enough info to undo and redo said change. 
class ActionRecord {

  readonly move: Move
  readonly action: Action
  readonly captured: Piece | undefined                     // needed to undo a 'capture'
  annotatedResult: AnnotatedResult | null  // stored here to follow notation conventions

  constructor(move: Move, action: Action, captured?: Piece, annotatedResult?: AnnotatedResult) {
    this.move = move
    this.action = action
    this.captured = captured
    this.annotatedResult = annotatedResult ?? null
  }

  toRichLANString() {
    return this._toLANString('sT')
  }

  toCommonLANString() {
    return this._toLANString('T')
  }

  private _toLANString(pieceFormat: PieceFormat | 'none'): string {

    if (this.action === 'castle') {
      return `${this.move.piece.side === 'white' ? 'w' : 'b'}${this.move.to.file === 'g' ? '0-0' : '0-0-0'}`
    }
  
    let str = (pieceFormat === 'none') ? 
      positionToString(this.move.from)  
      :
      pieceToString(this.move.piece, pieceFormat) + positionToString(this.move.from)
  
    switch (this.action) {
      case 'capture':
        str += `x${PIECETYPE_NAMES[this.captured!.type].short}${positionToString(this.move.to)}`
      break
      case 'move':
        str += positionToString(this.move.to)
      break
      case 'promote':
        str += `${positionToString(this.move.to)}=Q`
      break
      case 'capturePromote':
        str += `x${PIECETYPE_NAMES[this.captured!.type].short}${positionToString(this.move.to)}=Q`
      break
    } 
  
    if (this.annotatedResult) {
      str += ANNOTATION_FROM_RESULT[this.annotatedResult]
    }
  
    return str
  }

  static fromRichLANString = (lan: string): ActionRecord => {

    if (lan.includes('0-0')) {
      const toFile = lan.includes('0-0-0') ? 'c' : 'g'
      const side = (lan.charAt(0) === 'w') ? 'white' : 'black'
      const rank = (side === 'white') ? 1 : 8
      return new ActionRecord(
        {
          piece: {type: 'king', side},
          to: {rank, file: toFile},  
          from: {rank, file: 'e'},
        },
        'castle' 
      )
    }
  
    const piece = pieceFromCodeString(lan.slice(0,2))
    const from = positionFromString(lan.slice(2,4))
    const isCapture = lan.charAt(4) === 'x'
    const captured = isCapture ? {type: PIECETYPE_FROM_CODE[lan.charAt(5) as PieceTypeCode] as PieceType, side: otherSide(piece!.side)} : undefined
    const toPositionIndex = (isCapture) ? 6 : 4
    const to = positionFromString(lan.slice(toPositionIndex, toPositionIndex + 2))
    const isPromote = lan.slice(toPositionIndex + 2, 2) === '=Q'
  
    let index = -1
    ANNOTATIONS.every((el, i) => {
      if (lan.endsWith(el)) {
        index = i
        return false
      }  
      return true
    })
    const annotatedResult = (index === -1) ? undefined : ANNOTATEDRESULTS[index]
    
    if (!piece) throw new Error('lanToActionRecord(): error parsing piece!')
    if (!from) throw new Error('lanToActionRecord(): error parsing from poistion!')
    if (!to) throw new Error('lanToActionRecord(): error parsing to poistion!')
  
    let action: Action
    if (isCapture) {
      action = isPromote ? 'capturePromote' : 'capture' 
    }
    else {
      action = isPromote ? 'promote' : 'move'
    }
  
    return new ActionRecord(
      { piece, to, from }, 
      action, 
      captured, 
      annotatedResult
    )
  }
}


export { 
  ActionRecord as default,
  type AnnotatedResult,
  type ActionMode,
  ANNOTATION_FROM_RESULT,
  ANNOTATIONS,
  ANNOTATEDRESULTS,
}
