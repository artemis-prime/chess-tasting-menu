import { type PropertyValue } from '@stitches/react'

const utils = {

    // MARGIN
  m: (value: PropertyValue<'margin'>) => ({
    margin: value,
  }),
  mx: (value: PropertyValue<'margin'>) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: (value: PropertyValue<'margin'>) => ({
    marginTop: value,
    marginBottom: value,
  }),
  mt: (value: PropertyValue<'margin'>) => ({
    marginTop: value,
  }),
  mb: (value: PropertyValue<'margin'>) => ({
    marginBottom: value,
  }),
  ml: (value: PropertyValue<'margin'>) => ({
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
  size: (value: PropertyValue<'width'>) => ({
    width: value,
    height: value,
  }),
}

export default utils
