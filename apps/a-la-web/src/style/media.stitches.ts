const BREAKPOINTS = {
  phone: 0,
  tablet: 525,
  md: 768,
  menuBreak: 950,
  maxStaging: 1280, // (x768)
  xl: 1625,
  xxl: 1750
} as {
  [key in string]: number
}

const media = {
  allMobilePortrait: '(orientation: portrait) and (pointer: coarse) and (hover: none)',
  allMobileLandscape: '(orientation: landscape) and (pointer: coarse) and (hover: none)',
  allMobile: '(pointer: coarse) and (hover: none)',

  phonePortrait: `(orientation: portrait) and (pointer: coarse) and (hover: none)`,
  tabletPortrait: `(min-width: ${BREAKPOINTS.tablet}px) and (orientation: portrait) and (pointer: coarse) and (hover: none)`,
  tabletLargePortrait: `(min-width: ${BREAKPOINTS.menuBreak}px) and (orientation: portrait) and (pointer: coarse) and (hover: none)`,

  phoneLandscape: `(orientation: landscape) and (pointer: coarse) and (hover: none)`,
  tabletLandscape: `(min-height: ${BREAKPOINTS.tablet}px) and (orientation: landscape) and (pointer: coarse) and (hover: none)`,
  tabletLargeLandscape: `(min-height: ${BREAKPOINTS.menuBreak}px) and (orientation: landscape) and (pointer: coarse) and (hover: none)`,

  deskPortrait: `(orientation: portrait) and (pointer: fine)`, 

  deskSmallest: `(orientation: landscape) and (pointer: fine)`, 
  deskSmaller: `(min-width: ${BREAKPOINTS.tablet}px) and (orientation: landscape) and (pointer: fine)`, 
  deskSmall: `(min-width: ${BREAKPOINTS.md}px) and (orientation: landscape) and (pointer: fine)`, 
  menuBreak: `(min-width: ${BREAKPOINTS.menuBreak}px) and (orientation: landscape) and (pointer: fine)`, 
  maxStaging: `(min-width: ${BREAKPOINTS.maxStaging}px) and (pointer: fine)`, 
  xl: `(min-width: ${BREAKPOINTS.xl}px) and (pointer: fine)`, 
  xxl: `(min-width: ${BREAKPOINTS.xxl}px) and (pointer: fine)` 
} 

type MediaQuery = keyof typeof media

export {
  media as default,
  type MediaQuery,
  BREAKPOINTS,
}
