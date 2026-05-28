import type WidgetIconDesc from './WidgetIconDesc'

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
  draw: {icon: '=', style: {fontSize: 26, fontWeight: '300'}},
  concede: {icon: 'ignore', style: {fontSize: 17, fontWeight: '300'}},
  reset: {icon: ICONS.counterClockWiseArrow, style: {fontSize: 32}},
  saveGame: {icon: ICONS.toInbox, style: {fontSize: 19}},
  restoreGame: {icon: ICONS.fromInbox, style: {fontSize: 19}}
} as {
  [key in string]: WidgetIconDesc
}