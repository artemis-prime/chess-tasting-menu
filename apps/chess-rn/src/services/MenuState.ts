import { makeObservable, observable, action } from 'mobx'
interface MenuState {
  open: boolean,
  setOpen: (b: boolean) => void
}

class MenuStateImpl implements MenuState {
  
  open: boolean = false
  
  constructor() {
    makeObservable(this, {
      open: observable,
      setOpen: action.bound 
    })
  }

  setOpen(b: boolean) { this.open = b }
}

export { type MenuState as default, MenuStateImpl}
