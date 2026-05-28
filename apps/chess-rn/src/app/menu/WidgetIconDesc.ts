interface IconAndStyles {
  icon: string 
  style: any
}

type WidgetIconDesc = string | IconAndStyles

const EMPTY_ICON = 'space' 

export {
  type WidgetIconDesc as default,
  type IconAndStyles,
  EMPTY_ICON
}
