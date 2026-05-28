import  { type PropertyValue } from 'stitches-native'

const utils = {
  // MARGIN
  m: (value:  PropertyValue<'margin'>) => ({
    margin: value,
  }),
  mx: (value:  PropertyValue<'margin'>) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: (value:  PropertyValue<'margin'>) => ({
    marginTop: value,
    marginBottom: value,
  }),
  mt: (value:  PropertyValue<'margin'>) => ({
    marginTop: value,
  }),
  mb: (value:  PropertyValue<'margin'>) => ({
    marginBottom: value,
  }),
  ml: (value:  PropertyValue<'margin'>) => ({
    marginLeft: value,
  }),
  mr: (value: PropertyValue<'margin'>) => ({
    marginRight: value,
  }),

  // PADDING
  p: (value: PropertyValue<'padding'>) => ({
    padding: value,
  }),
  px: (value: PropertyValue<'padding'>) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  py: (value: PropertyValue<'padding'>) => ({
    paddingTop: value,
    paddingBottom: value,
  }),
  pt: (value: PropertyValue<'padding'>) => ({
    paddingTop: value,
  }),
  pb: (value: PropertyValue<'padding'>) => ({
    paddingBottom: value,
  }),
  pl: (value: PropertyValue<'padding'>) => ({
    paddingLeft: value,
  }),
  pr: (value: PropertyValue<'padding'>) => ({
    paddingRight: value,
  }),
  // DIMENSIONS
  w: (value: PropertyValue<'width'>) => ({
    width: value,
  }),
  h: (value: PropertyValue<'height'>) => ({
    height: value,
  }),
  // OFFSET
  l: (value: PropertyValue<'left'>) => ({
    left: value,
  }),
  t: (value: PropertyValue<'top'>) => ({
    top: value,
  }),
  b: (value: PropertyValue<'bottom'>) => ({
    bottom: value,
  }),
  r: (value: PropertyValue<'right'>) => ({
    right: value,
  }),
  size: (value: PropertyValue<'width'>) => ({
    width: value,
    height: value,
  }),
    // mimics visibility: 'hidden' | 'visible' 
  visible: (b: boolean) => ({
    opacity:  b ? 1 : 0,
    pointerEvents: b ? 'auto' : 'none'
  })
}

export default utils
