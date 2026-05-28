import type { WidgetIconDesc } from '~/primatives'

const ICONS = {
  twoVerticalArrows: '\u296F',
  clockwiseCircleArrow: '\u27F3',
  counterClockWiseArrow: '\u21ba',
  burger: '\u2630',
  toInbox: '\u{1F4E5}\uFE0E',
  fromInbox: '\u{1F4E4}\uFE0E',
}

export default {
  swap: ICONS.twoVerticalArrows,
  autoSwap: ICONS.clockwiseCircleArrow,
  draw: {icon: '=', style: {fontSize: '26px', fontWeight: 400}},
  concede: {icon: 'ignore', style: {fontSize: '17px', fontWeight: 400}},
  reset: {icon: ICONS.counterClockWiseArrow, style: {fontSize: '26px'}},
  saveGame: {icon: ICONS.toInbox, style: {fontSize: '19px'}},
  restoreGame: {icon: ICONS.fromInbox, style: {fontSize: '19px'}}
} as {
  [key in string]: WidgetIconDesc
}