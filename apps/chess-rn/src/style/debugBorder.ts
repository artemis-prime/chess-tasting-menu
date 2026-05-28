import type { ColorValue } from "react-native/types"

const showForGroup = {
  menu: false,
  menuOuter: false,
  header: false,
  chalkboard: false,
  checkbox: false,
  layout: false,
  layoutInner: false,
  moves: false,
  movesLayout: false,
  movesRow: false,
  movesH: false
}

type GroupsKey = keyof typeof showForGroup

const debugBorder = (color: ColorValue | null, group?: string) => (
  (
    color === null || color === '' || color === 'none' || color === 'off' 
    || 
    (group && group in showForGroup && !showForGroup[group as GroupsKey]) 
  ) 
    ? 
    {} 
    : 
    {
      borderWidth: 1,
      borderColor: color,
    }
)

export default debugBorder
