import type { VariantProps } from '@stitches/react'
import { styled, menu } from '~/style'

const buttonCommon = {
  cursor: 'pointer',
  padding: '5px 12px',
  border: '1.5px solid $gray1',
  borderRadius: '8px',
}

const Button = styled('button', {

  outline: 'none',
  p: 2,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    
    variant: {
      contained: {
        ...buttonCommon,
      },
      outlined: {
        ...buttonCommon,
        backgroundColor: 'transparent',
        color: '$gray1',
        '&:disabled': {
          cursor: 'default',
          borderColor: '$gray11',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'none',
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
          // pressed
        '&:active': {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      },
      // outlined, but with alert colors
      alert: {
        ...buttonCommon,
        color: '$gray1',
        backgroundColor: '$alert9',
        '&:hover': {
          backgroundColor: '$alert8',
        },
          // pressed
        '&:active': {
          backgroundColor: '$alert7' ,
        },
      },

      ghost: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent',
        p: 1,
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:disabled': {
          cursor: 'default',
        },
        '&:disabled:hover': {
          textDecoration: 'none',
        },
      
      },
    },
    chalkboard: {
      true: {
        color: '$chalkboardTextColor',
        fontFamily: '$chalkboardFont',
        '&:disabled': {
          color: '$chalkboardTextColorDisabled',
        },
      }
    },
    menu: {
      true: {
        fontSize: 'inherit',
        lineHeight: 'inherit',
        '&:disabled': {
          color: '$menuTextColorDisabled',
        },
      }
    },
  },
  compoundVariants: [
    {
      chalkboard: true,
      variant: 'contained',
      css: {
        color: '$gray1',
        backgroundColor: '$gray11',
        '&:hover': {
          backgroundColor: '$gray10'
        },
          // pressed
        '&:active': {
          backgroundColor: '$gray8' 
        },
      }  
    },
    {
      menu: true,
      variant: 'contained',
      css: {
        color: '$gray1',
        backgroundColor: '$menuContainedButtonColor',
        '&:hover': {
          backgroundColor: '$menuContainedButtonColorHover'
        },
          // pressed
        '&:active': {
          backgroundColor: '$menuContainedButtonColorPressed' 
        },
      }  
    },
    {
      menu: true,
      variant: 'ghost',
      css: {
        ...menu.menuBarTrigger,
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '$menuBGColor',
        px: '$1_5',
        '&:hover': {
          textDecoration: 'none',
          backgroundColor: '$menuBGColorHover',
          '&:disabled': {
            backgroundColor: '$menuBGColor',
          } 
        },
        '&:disabled': {
          cursor: 'default',
          color: '$menuTextColorDisabled'
        },
      }  
    },
  ],
  defaultVariants: {
    variant: 'ghost',
    chalkboard: true,
    menu: false
  },
})
type ButtonVariants = VariantProps<typeof Button>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type ButtonVariant = ButtonVariants['variant'] 



export {
  Button as default,
  type ButtonVariant,
}
