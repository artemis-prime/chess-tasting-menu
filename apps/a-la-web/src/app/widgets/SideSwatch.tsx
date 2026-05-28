import { styled } from '~/style'

const SideSwatch = styled('span', {

  display: 'inline-block',
  verticalAlign: 'middle',

  h: '1em', 
  w: '3em',
  borderRadius: '$sm',
  borderWidth: '$thicker',
  borderColor: '#777',
  borderStyle: '$solid',

  variants: {
    side: {
      white: {
        backgroundColor: '$pieceColorWhite'
      },
      black: {
        backgroundColor: '$pieceColorBlack'
      },
    },
    small: {
      true: {
        h: '1em', 
        w: '1em',
        borderWidth: '$normal',
      }
    },
    narrow: {
      true: {
        height: '1em',
        // width is set dynamically
        borderWidth: '$normal', 
      }
    }
  }
})

export default SideSwatch
