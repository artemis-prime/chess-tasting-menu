import {type CSS} from '@stitches/react'
import type { MediaQuery } from './media.stitches'

  // typeof 'number' vs 'string' signals different 
  // logic in calling code
const WIDTH = {
  deskSmallest: '240px',
  deskSmaller: '260px',
  deskSmall: '280px',
  menuBreak: '340px',
  maxStaging: 320,
  xl: 400,
  xxl: 450,
}

type Key = keyof typeof WIDTH

const applySideWidthsToStyles = (
  styles: CSS, 
  fieldName: string, 
  getFieldValue: (value: any) => string, 
  extended: boolean = false
): CSS => {

  const keys = Object.keys(WIDTH) as MediaQuery[]
  const map = new Map<string, any>()
  keys.forEach((key) => {
    if (!extended && key.includes('Doubled')) return;

      // Insert the values into a map (which iterates in insertion order)
      // so we can gaurantee the intended order application of the media query rules.
      // Otherwise the order depends on whether some
      // were already defined in the source css or not! 
      // (Very bad news since css effects are order-dependent!)
    const value: any = (`@${key}` in styles) ? styles[`@${key}`]! : {}
    delete styles[`@${key}`]
    value[fieldName] = getFieldValue(WIDTH[key as Key]) 
    map.set(`@${key}`, value)
  })
  map.forEach((val, key) => {
    styles[key] = val
  })

  return styles
}

export {
  WIDTH as default,
  applySideWidthsToStyles
}