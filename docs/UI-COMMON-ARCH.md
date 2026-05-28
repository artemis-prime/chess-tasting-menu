# UI Architecture 

This document exists precisely because an effort was made to keep the UI *architecture*, if not implementation, as similar as possible on both platforms. Ultimately React is React, whether Native or Web, so organizing an app shouldn't have to differ much from one to the other.

## Main Organization

* **`app`**: the specific implementation of the app UI itself, including layout, domain-specific feature components, etc. Usually contains a `widgets` subdirectory. 
* **`primatives`**: common components that are not domain-specific and likely reused in many places in the app. These would include general UI elements like `Button`, `Dialog`, `Drawer` etc. 
* **`services`**: all cross-cutting concerns, often implemented using React `Context`s / `Provider`s, and hooks.
* **`style`**: anything style or theming realated. Any styling specific to a component is encapsulated in that component. This directory contains the necessary support for that encapsulation.  

* ( **`domain`** ): In an app where **the domain is in the same directory** --a single-app non-monorepo, there'd be **a `domain` directory**. It would contain the equivalent of what `just-the-chess` does in our repo.  (See the [Core Architecture doc](./just-the-chess/CORE_ARCH.md) for more on that.)

Over many projects, I've found this organization to be a clear, simple, and expressive enough to succeed at many levels of complexity.  

## **Stitches**: Look Ma, no framework.

The more I've used more feature-packed, turn-key frameworks like [Material UI](https://mui.com/), the more seem like a double-edged sword. On the one hand, if your UI is strongly aligned with the design concept of a framework, and you need to develop something asap, they can ease things dramatically. On the other, if you're building something more idiosyncratic (like a Chess game), or only have a few common component variants, you can waste a lot of time fighting (ie, "customizing") the framework just to achieve simple goals. 

Enter [Stitches](https://stitches.dev/). Stitches and it's excellent React Native port, [stitches-native](https://github.com/Temzasse/stitches-native), have truly managed to find the sweetspot between simplicity and power. With it, you can quickly create useful styled components while not burdening the project with design assumptions you don't share, or needless layers of framework code to fight. In the time saved, you can easily develop the `primatives` you actually need!

Stitches has many features, but truly shines in two areas:

### **Theming**
Stitches theming offers a powerful way to create and use virtually *any set of desired design tokens* via it's powerful the '$' notation (shown below)

```typescript
const { styled } = createStitches({
  theme: {
    colors: {
      hiContrast: 'hsl(206,10%,5%)',
      loContrast: 'white',

      gray100: 'hsl(206,22%,99%)',
      gray200: 'hsl(206,12%,97%)',
      gray300: 'hsl(206,11%,92%)',
    },
  },
  space: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  fonts: {},
  // etc
})

export { styled }

~~~~~~~~

import { styled } from 'styles/stitches.config'

const MyComponent = styled('div', {
  backgroundColor: '$gray300'
  padding: '$sm'
})

```

### **style / prop variants**
Using a truely powerful and innovative syntax, Stitches brings incredible convenience in specifying prop variants right from style blocks. For example,

```typescript
const Button = styled('button', {

  backgroundColor: 'transparent',
  borderRadius: '3px',
  height: '1.1rem',

  variants: {
    type: {
      alert: {
        backgroundColor: '$orange11',
        color: 'white',
        '&:hover': {
          backgroundColor: '$orange5',
        },
      },
      common: {
        color: '#111',
        '&:hover': {
          backgroundColor: '$gray4',
        },
      },
    },
    smaller: {
      true: {
        height: '0.9rem',
      }
    }
  },
  devaultVariants: {
    type: 'common'
  }
})

// ...

<Button type='alert' smaller>Got it!</Button>

```

This feature has proven to be particularly powerful when dealing with the very UI variants that arise in showing domain-specific states or types.  For example, `Action`s such as `'move'` or `'capture'` can have corresponding prop variants that make up the appearance of a square, as shown below.  

## Key Implementations and Uses of Domain

### **Square and Piece components**
As mentioned in the [core architecture doc](./CORE_ARCH.md), the core provides two observable state variables for a `Square` which enables the UI to render it: `occupant` and `squareState`

`SquareComponent`  simply displays feedback  by translating `squareState` it into internal effects variants, some of which correspond directly to `Action`s and some of which are variants of them:

```typescript
  // simplified for clarity
const SquareComponent: React.FC<{
  square: Square 
}> = observer(({
  square
}) => {

  const pulse = usePulse() // alternating ticks from a setInterval() for pulsing effects

  const getEffectFromState = (state: SquareState): EffectVariant  => {
    if (state === 'castleRookFrom') {
      return pulse.on ? state : 'castleRookFromPulse' 
    }
    else if (state === 'castleRookTo') {
      return !pulse.on ? state : 'castleRookToPulse' 
    }
    else if (state.includes('romote')) {
      if (pulse.on) {
        return undefined
      }
    }
    else if ([
      'origin',
      'invalid',
      'none',
      'kingInCheck',
      'inCheckFrom',
      'capture'
    ].includes(state as string)) {
      return undefined
    }
      // pass others through as they are
    return state as EffectVariant 
  }

  return (
    <SquareEffectsView effect={getEffectFromState(square.squareState)} >
      <PieceComponent square={square} />  
    </SquareEffectsView>
  )
})

```

SquareEffectsView implements the square's state effects:

```typescript
const SquareEffectsView = styled('div', {
    // common styles
  variants: {
    effect: {
      move: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promote: {
        border: '1px yellow solid'
      },
      castle: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promoteCapture: {
        border: '1px yellow solid'
      },
      castleRookFrom: {
        border: '1px darkgreen solid' 
      },
      castleRookTo: {
        border: '1px darkgreen solid' 
      },
      castleRookFromPulse: {
        border: '3px darkgreen solid' 
      },
      castleRookToPulse: {
        border: '3px darkgreen solid' 
      },
    }
  }
})

```

`PieceComponent` follows a similar pattern:

```typescript
// edited for clarity
const PieceComponent: React.FC<{
  square: Square 
}> = observer(({
  square
}) => {

  const game = useGame()
  const pulse = usePulse()

  const canDrag = square.occupant && game.currentTurn === square.occupant.side

  const getEffectFromState = (state: SquareState): EffectVariant => {
    if (state.includes('capture')) {
      return pulse.on ? 'capture' : 'capturePulse' 
    }
      // These next two should alternate their pulse effect 
    else if (state === 'kingInCheck') {
      return pulse.on ? 'kingInCheck' : 'kingInCheckPulse' 
    }
    else if (state === 'inCheckFrom') {
      return !pulse.on ? 'inCheckFrom' : 'inCheckFromPulse' 
    }
    return undefined 
  }

    // get specific renderer by piece type
  const SpecificPiece = registry.get(square.occupant.type) 

    // dim me if I'm the origin of the drag
    // set cursor based on dragability and state
  return (
    <PieceEffectsView 
      side={square.occupant.side}
      effect={getEffectFromState(square.squareState)}
      css={{
        opacity: (square.squareState === 'origin' ? 0.5 : 1), 
        cursor: canDrag ? (square.squareState === 'origin' ? 'move' : 'pointer') : 'default',
      }}
    >
      <SpecificPiece />
    </PieceEffectsView>
  )
})
```

The `PieceEffectsView` in this case contains Stitches *compound variants* that vary the size and dropshadow of the piece. For example, these represent the pulsing effect of the black King when its in check. 

Pulsing between:

normal(ish) <--> slightly larger with a bigger reddish dropshadow


```typescript
    {
      side: 'black', 
      effect: 'kingInCheck',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.2))'
        }  
      }
    },
    {
      side: 'black',
      effect: 'kingInCheckPulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(145, 23, 2))',
          transform: 'scale(1.1)'
        }  
      }
    },
 ```

### **Drag and Drop and the Core**

Because of how I've [architected the core](./CORE_ARCH.md), the DnD code's job very simple: to attempt to resolve `Action`s as a square is hovered over, and take the `Action` on drop.

<image src='./ui-core-interaction-dnd.png' width='70%'/>

In both versions of the app, there is a very similar module called `ChessDnDShell` that wraps the `Board` component, each with a corresponding `Context` / `Provider`, `useDragState` hook, etc.  On web, it's implemented using [dnd-kit](https://dndkit.com/), whereas on RN, it uses [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler/) and partially hand-rolls the DnD functionality. But the onlines of both implementations are **almost identical** in structure and interface.  

In fact, one of few real differences is that the RN version has to do it's own hit testing to determine what square is being dragged over whereas the web version doesn't. Otherwise, the logic is the same...

Web: 
```typescript
  const stateRef = useRef<DnDState>(getDnDState())

  const onDragUpdate = (event: DragMoveEvent) => {
      // A valid position?  (event.over.data is the Position currently being hovered over)
    const pos = (event.over && event.over.data.current) ? event.over.data.current.position : null
      // Is this an actual intended drag that's been properly initiated?
    if (pos && stateRef.current.piece) {
          // Have we've entered a new square that's not been tested yet?
      if (!positionsEqual(pos, stateRef.current.squareOver!)) {
        game.resolveAction({
          piece: stateRef.current.piece, 
          from: stateRef.current.from!,   
          to: pos
        })
        stateRef.current.setSquareOver(pos)
      }
    }
  }
```

RN:
```typescript
  const stateRef = useRef<DnDState>(getDnDState())

  const onDragUpdate = (e: PanGestureHandlerEventPayload) => {
    if (stateRef.current.piece) {
      const { x, y } = e 
      const pos = squareFromTouchOffset({x, y})
      if (pos) {
        if (!positionsEqual(pos, stateRef.current.squareOver!)) {
          game.resolveAction({
            piece: stateRef.current.piece, 
            from: stateRef.current.from,  
            to: pos
          })
          stateRef.current.setSquareOver(pos)
        }
      }
    }
  }
```

[return to main doc](../README.md)
