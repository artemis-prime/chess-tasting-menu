import { StyleSheet } from 'react-native'
import { createStitches } from 'stitches-native'
import DeviceInfo from 'react-native-device-info'
import { gray, orange } from '@radix-ui/colors'

import utils from './utils.stitches'

const isTablet = DeviceInfo.isTablet()

const LINEHEIGHTS = {
  lineHeightMenu: 40,
  lineHeightChalkboardNormal: 26,
  lineHeightChalkboardSmaller: 22,
  lineHeightChalkboardSmall: 20,
  lineHeightChalkboardShort: 18
} 

// Cf: https://github.com/Temzasse/stitches-native/blob/main/example/src/styles/styled.ts#L56
const { 
  config: { media },
  css, 
  styled,
  useTheme, 
  theme,
  ThemeProvider  
} = createStitches({

  utils,
  media: {
    phone: !isTablet,
    tablet: isTablet
  },
  theme: {
      // Cf: apps/chess-web/src/style/colors.module.scss
    colors: {
      ...gray,
      ...orange,

      alert1: '$orange1',
      alert2: '$orange2',
      alert3: '$orange3',
      alert4: '$orange4',
      alert5: '$orange5',
      alert6: '$orange6',
      alert7: '$orange7',
      alert8: '$orange8',
      alert9: '$orange9',
      alert10: '$orange10',
      alert11: '$orange11',
      alert12: '$orange12',

      navy3: 'hsl(226, 56.0%, 34.5%)',    
      navy4: 'hsl(226, 39.2%, 42%)',
      navy5: 'hsl(226, 39.2%, 46%)',
      navy6: 'hsl(226, 39.2%, 52%)',
      navy7: 'hsl(226, 39.2%, 60%)',

      pieceColorBlack: '#573131',
      pieceColorWhite: '#f7f0be',
      chalkboardBorderColor: '$pieceColorBlack',
      chessboardBrown: 'rgba(124, 79, 52, 0.60)',
      // $brown-darker: rgba(105, 49, 49, 0.75); // web

      chalkboardTextColor: 'rgba(255, 255, 255, 0.9)',
      chalkboardTextColorDisabled: '$gray11',
      chalkboardButtonPressedBG: 'rgba(255, 255, 255, 0.3)',

      menuBGColor: '$navy3',    
      menuBGColorHover: '$navy4', 
      menuBGColorSelectedHover: '$navy5' ,
      menuBGColorPressed: '$navy6', 

      menuTextColor: 'rgba(255, 255, 255, 0.9)',
      menuTextColorDisabled: 'rgba(255, 255, 255, 0.45)',
      
      menuContainedButtonColor: '$navy5',
      menuContainedButtonColorHover: '$navy6',
      menuContainedButtonColorPressed: '$navy7',
   
    },
    fonts: {
      chalkboardFont: 'IDidThis',
      menuFont: 'Roboto'
    },
    fontWeights: {
      bold: '700',
      semibold: '500',
      normal: '400',
    },
    borderStyles: {
      solid: 'solid',
    },
    borderWidths: {
      hairline: StyleSheet.hairlineWidth,
      normal: 1,
      thicker: 2,
      thick: 3,
    },
    fontSizes: {
      fontSizeNormal: LINEHEIGHTS.lineHeightChalkboardNormal * 0.7,
      fontSizeLarger: LINEHEIGHTS.lineHeightChalkboardNormal * 0.8,
      fontSizeSmaller: LINEHEIGHTS.lineHeightChalkboardSmaller * 0.7,  
      fontSizeSmall: LINEHEIGHTS.lineHeightChalkboardSmall * 0.7,  
      fontSizeEmojiSmaller: LINEHEIGHTS.lineHeightChalkboardSmall * 0.6,  
      fontSizeEmoji: LINEHEIGHTS.lineHeightChalkboardSmall * 0.7,  
      fontSizeEmojiLarger: LINEHEIGHTS.lineHeightChalkboardSmall * 0.8,  
      fontSizeEmojiLarge: LINEHEIGHTS.lineHeightChalkboardSmall * 0.9,  
      fontSizeMenuItem: LINEHEIGHTS.lineHeightMenu * .5,
    },
    lineHeights: {
      ...LINEHEIGHTS
    },
    letterSpacings: {
      tight: 0.1,
      sparse: 1,
    },
    zIndices: {
      modal: 1000,
    },
    space: {
      '_5': 4,
      1: 7,
      '1_5': 11,
      2: 16,
      3: 23,
      4: 32,
      5: 40,
      6: 48,
      pyMenuSeparator: 7,
      pxMenu: 11,
      spaceAppBarHeight: 42,
      spaceBig: 64,
    },
    sizes: {
      hairlineWidth: StyleSheet.hairlineWidth,
      ...LINEHEIGHTS,
      appBarHeight: 42,
      swatchHNormal: LINEHEIGHTS.lineHeightChalkboardNormal * 0.8,
      swatchWNormal: LINEHEIGHTS.lineHeightChalkboardNormal * 1.3, 
      swatchHSmall: LINEHEIGHTS.lineHeightChalkboardNormal * 0.6,
      swatchWSmall: LINEHEIGHTS.lineHeightChalkboardNormal * 0.6,
      menuIconSize: 24,
    },
    radii: {
      none: 0,
      sm: 3,
      md: 8,
      lgr: 12,
      lg: 16,
      rounded: 999,
      menuRadius: 999,
    },
  },    
})

export { 
  media,
  css, 
  styled,
  useTheme, 
  theme,
  ThemeProvider,  
} 
