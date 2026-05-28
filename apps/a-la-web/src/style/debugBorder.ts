const showForGroup = {
  menu: false,
  menuOuter: false,
  layout: false,
  header: false,
  chalk: false
}

type GroupsKey = keyof typeof showForGroup

const debugBorder = (color: string, group?: string) => (
  (color === 'off' || (group && group in showForGroup && !showForGroup[group as GroupsKey]) ) 
    ? 
    {} 
    : 
    {
      borderStyle: 'solid',
      borderWidth: '0.5px',
      borderColor: color,
    }
)

export default debugBorder