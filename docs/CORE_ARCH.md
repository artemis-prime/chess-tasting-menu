# The Game of Chess


## **Structural domain:** Board, Squares, and Pieces


* The `Game` (the interface to client code) owns a `Board` which wraps a `BoardSquares`. 
* `BoardSquares` is a basically an 8x8 matrix of `Square`s. 
* A `Square` is a `Position`, with a nullable `Piece`, and a `SquareState` 
    * `SquareState`: More on this in the "behavioral" section, but basically the current role of the Square in a move. eg, if its `origin`, the UI can show it slighly dimmed during a drag operation.

* A `Position` is a location on the board (a Rank and a File), whereas a `Square` is the actual holder of state of that slot in `BoardSquares`.
* A `Piece` is a `Side` and a `PieceType`

So, something like this...

```typescript
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

interface Piece {
  readonly type: PieceType
  readonly side: Side
} 


interface Position {
  rank: Rank // 1 - 8
  file: File // a - h
}

// within BoardSquares / Board
class Square implements Position {
  readonly rank: Rank 
  readonly file: File 
  occupant: Piece | null  // observable state, if null, Square is empty
  state: SquareState      // observable state ( indicated roll in corrent or previous move: 'origin', 'valid move', 'possible capture', etc)
}

```

The above contains enough symantics for any UI to render the Chess game in any meaningful state.

## **Behavior Domain:** Moves, Actions, and Resolutions

The architecture centers around the notion of `Move`s and resolvable `Action`s.  If a pawn moves forward a row (or sometimes two) into an empty square, its "resolved action" is `'move'`.  If it moves forward diagonally into a square occupied by an opponent, it's resolved action is `'capture'`. If it does something else, there is no resolution.

`Resolution` refers to the process of determining an allowable action for a give move by a given piece.  In practice, this might would be determined as a piece is dragged over a new square.  During a drag operation, we're constantly asking,

"Is there an allowable move for this piece to this square?" 

codewise...

```typescript
  // in app code

  onDrag({x, y, payload: {draggingPiece, originSquare}}) {

    const newSquare = squareIfChanged(x, y)
    if (newSquare) {
      game.resolveAction({draggingPiece, originSquare, newSquare})
    }
  }
```

```typescript
  // in core

  interface Move {
    piece: Piece
    from: Position
    to: Position
  }

  type Action = 'move' | 'capture' | 'promote' | 'castle' |  'capturePromote'

  ~~~

  class Game {

    //...
    resolveAction(move: Move): Action | null {
      const resolver = getResolverForType(piece)
      const action = resolver.resolve(move) // returns an allowable Action or null

      this.applyResolution(move, action)
    }
  }

```

Depending on the square's possible function in the current move `applyResolution` changes `squareState` for this square. (And possibly others, if `Action` is say, `'castle'`. This involves four squares changing: King's `from` and `to`, and Rook's `from` and `to`!)

Reacting to changes in `squareState`, the UI can display various forms of feedback.  These could include a green circle in an empty square being dragged over as a valid move, or in the case of potential `'capture'`, the opponent's piece pulsing larger with a thicker dropshadow. 


## **Reactive UI**

To implement such responses, as well render state generally, we use the fantastic [`mobx`](https://mobx.js.org/) library. Among other great qualities, it's very conducive to Domain Driven Design since it doesn't impose its own concepts on the architecture.  Unlike with other state management solutions, its whole approach emphasizes simplicity and transparency. There is no notion of a 'Store' per se: any objects or individual fields of objects can be `observable`. Just implement the domain as you would, while making certain things `observable`, and the UI will render properly. Magic.

And involves wonderfully little code. All we do is wrap any Functional Component or `render` method in `observer`, dereference any `observable`s we need to, and things just work. No store, no reducers ...well, yes to 'actions', but they're simpler and more sensible than `Redux`'s.

As a simple example, a `Square` above has two `observable` fields, `occupant` and `squareState`. When either of them is changed by the core, the `SquareComponent` that dereferences them gets rerendered.

```typescript
import { observer } from 'mobx-react'

const SquareComponent: React.FC<{ square: Square }> = observer(({ square }) => 
{
  return (
    <div style={{
      border: (square.squareState === 'move' ? '1px solid green' : 'none') 
    }}>
      {square.occupant && (<PieceComponent piece={square.occupant} state={square.squareState})} />)}
    </div>
  )
})

```

This discussion serves to illustrated the key structural and behavioral patterns in the domain, as well as how the UI responds to and renders them. For more insight, see the [UI Architecture doc here](./UI-COMMON-ARCH.md)

## **Notable Features and Implementation Choices**

### **Undo / Redo support**
There is a stack of `ActionRecord`'s that can be traversed back and forth easily for undo / redo.  An `ActionRecord` is "applied" to the Game in three modes: `'do' | 'undo' | 'redo'`.  This encapsulates state transitions simply and intuitively.

### **Action Resolution System**
This has been partially discussed above. With Drag and Drop in mind, a move is conceived as follows:

  * A call to `resolveAction()` provides a resolution.
  * **This is cached** for the same `Move`, until:
  * either `takeResolvedAction()` or `abandonResolution()` are called
  * Note that this is a form of debouncing that avoids running complex piece-specific logic in response to say, mouse events


```typescript
resolveAction(m: Move): Action | null // result is cached and returned to caller
takeResolvedAction(): boolean         // true if action was taken
abandonResolution(): void             // call if drag was abandoned or finished on an invalid drop target 
```
### **'Put yourself in Check' support via a 'scratch' `Board`** 
Since some moves could result in a player putting themselves into, or failing to get out of, check, we have to screen for this on every `Move` before it's actually resolved to an 'Action'. (Any other approach would have each piece being responsible for this internally, which would be much more complicated complicated.)

I chose to accomplish this via a 'scratch' `Board` that exists solely for this purpose. On every attempted resolution,

  1) The scratch `Board` is quickly synced to the exact state of the "real" `Board`
  2) The same `ActionRecord` that would used for the real action is actually 'applied' to the scratch `Board`.
  3) The 'in check' state is tested for and depending on this hypothetical result with the scratch `Board`, the `Action` is either resolved as normal or rejected.
  
This may sound complicated, but it has several advantages. Mainly, it ensures that there's no risk of game state becoming unpoluted by any side-effects of testing for check. Also, core logic is kept as simple as possible, since the same sequence of steps is used on the scratch `Board` as would be used to actually take an action. 

### **Resolver Registry**
There is a registry of `ActionResolver`'s based on piece type.  They live in `game/resolvers`  And are initialized to a `Map` in `game/resolverRegistry.ts`....

```typescript
import pawn from './resolvers/pawn'
import queen from './resolvers/queen' 
import bishop from './resolvers/bishop'
import rook from './resolvers/rook' 
import knight from './resolvers/knight' 
import king from './resolvers/king' 

export default new Map<PieceType, ActionResolver>([
  ['pawn', pawn],
  ['queen', queen],
  ['bishop', bishop],
  ['rook', rook],
  ['knight', knight],
  ['king', king]
])
```

For example, Bishop's resolver looks like this:

```typescript
// game/resolvers/bishop.ts

const resolve = (
  board: Board,
  move: Move
): Action | null => {
  
  if (board.isClearAlongDiagonal(move.from, move.to)) {
    const fromSide = board.getOccupantSide(move.from)
    const toSide = board.getOccupantSide(move.to)
    if (!toSide) {
      return 'move'
    }
    else if (fromSide && toSide && (fromSide !== toSide)) {
      return 'capture'
    }
  }
  return null
}

export { resolve }
```

This cleanly encapsulates the behavioral pattern per piece type. 

TL;DR: There are actually two methods in the interface: `resolve(board: Board, m: Move): Action | null` and also `resolvableMoves(board: Board, piece: Piece, from: Position): Position[]`. The latter is used internally to test for for checkmate and stalemate.

### **Tracking of Primaries**
In order to optimize the process of testing for "in check" discussed above, as well as checking for "checkmate", and "stalemate", the positions of "Primary Types" --all except 'pawn' and 'king', are tracked and updated with every move. This lives in `game/board/Tracking.ts`.

### **Persistence**
The entire Game, including pieces on the board, tracking, undo / redo stack, castling eligability, etc., can be converted to a condensed representation and persisted to JSON files. The JSON is quite human readable since it uses a modified version of [LAN (Long Algebraic Notation)](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)). Each core type involved, from `Game` on down, implements the `Snapshotable<T>` interface. 

```typescript
interface Snapshotable<T> {
  takeSnapshot: () => T
  restoreFromSnapshot: (s: T) => void
}

export { type Snapshotable as default }

~~~~~~

interface GameSnapshot {

  board: BoardSnapshot
  actions: string[]
  currentTurn: SideCode
  gameEnding?: string
}

interface Game extends Snapshotable<GameSnapshot> {

  // other stuff
  takeSnapshot() : GameSnapshot
  restoreFromSnapshot(g: GameSnapshot) : void
}

~~~~~~
// UI

const PersistToFileButton: React.FC<React.PropsWithChildren> = ({children}) => {

  const game = useGame()
  const aRef = useRef<HTMLAnchorElement>(null)
    
  const writeFile = () => {

    const gd = game.takeSnapshot()
    const gdjson = JSON.stringify(gd)
    const bytes = new TextEncoder().encode(gdjson)
    const blob = new Blob([bytes], {type: "application/json;charset=utf-8"})
    const dataURI = URL.createObjectURL(blob)
    if (aRef.current) {
      aRef.current.href = dataURI
      aRef.current.click()
    }
  }

  return (
    <>
      <Button onClick={writeFile}>{children}</Button>
      <a ref={aRef} download='game.json' hidden />
    </>
  )
}

```

### **Notification System** 
In addition to observing `mobx` state changes, client code can also subscribe to common events and messages by registering a `ChessListener`.  This can be convenient displaying messages or anything related to the current action, etc. 

```typescript

interface ChessListener {

  actionResolved(move: Move, action: Action | null): void
  actionTaken(r: ActionRecord, mode: ActionMode): void    // ActionMode is 'do' | 'undo' | 'redo'

    // eg, "You can't castle because your king has moved!"
  messageSent(s: string, type?: string): void 

  inCheck(c: Check): void       // 'Check' is who's in check, from what squares, etc.
  notInCheck(side: Side): void

  gameStatusChanged(s: GameStatus): void // 'stalemate', 'checkmate', etc.
}
```

[return to main doc](../README.md)