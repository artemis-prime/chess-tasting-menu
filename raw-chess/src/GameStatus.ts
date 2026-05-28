import {type Side} from './Piece'
import {type AnnotatedResult} from './ActionRecord'


const GAMERESULT_SYMBOLS = {
  victor: {
    white: '1-0',
    black: '0-1',
    draw: '½–½'
  },
  offer: ' (offer)',
  concession: ' (con)'
}

  // https://www.britannica.com/topic/chess
  // For our purposes, 'draw' covers anything but 'stalemate', 
  // and is set by user action (not calculated) 
type GameState = 'new' | 'restored' |'resumed' | 'draw' | 'conceded' | Omit<AnnotatedResult, 'check'>

const STATUS_IN_PLAY = ['new', 'restored', 'resumed'] as GameState[]
const STATUS_ENDED = ['conceded', 'checkmate', 'stalemate', 'draw'] as GameState[]
const STATUS_AGREED = ['conceded', 'draw'] as GameState[]
const STATUS_CAN_UNDO = [...STATUS_IN_PLAY, 'checkmate', 'stalemate'] as GameState[]

interface GameStatus {

  readonly state: GameState
    // 'none' if 'stalemate' or 'draw'; undefined if 'playing'
  readonly victor: Side | 'none' | undefined 
}

const gameEndingToString = (s: GameStatus): string | undefined => {
  let gameEnding = undefined
  if (STATUS_ENDED.includes(s.state)) {
    if (s.victor && s.victor !== 'none' ) {
      gameEnding = GAMERESULT_SYMBOLS.victor[s.victor] 
    }
    else {
      gameEnding = GAMERESULT_SYMBOLS.victor.draw  
    }
    if (s.state === 'conceded') {
      gameEnding += GAMERESULT_SYMBOLS.concession
    }
    else if (s.state === 'draw') {
      gameEnding += GAMERESULT_SYMBOLS.offer
    }
  }
  return gameEnding
}

  // str will always be valid, since we produced it
const gameEndingFromString = (str: string): GameStatus  => {

  const victor: Side | 'none' = (str.startsWith(GAMERESULT_SYMBOLS.victor.draw)) ? 'none' :
    str.startsWith(GAMERESULT_SYMBOLS.victor.white) ? 'white' : 'black';

  let state: GameState
  if (victor === 'none') {
    state = (str.endsWith(GAMERESULT_SYMBOLS.offer)) ? 'draw' : 'stalemate'
  }
  else {
    state = (str.endsWith(GAMERESULT_SYMBOLS.concession)) ? 'conceded' : 'checkmate'
  }
  return {
    state,
    victor
  }
}

export { 
  type GameStatus as default,
  gameEndingToString,
  gameEndingFromString,
  GAMERESULT_SYMBOLS,
  STATUS_IN_PLAY,
  STATUS_ENDED,
  STATUS_AGREED,
  STATUS_CAN_UNDO
} 