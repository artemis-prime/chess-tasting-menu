import { makeObservable, observable, action } from 'mobx'
interface ChalkboardState {
  open: boolean,
  setOpen: (b: boolean) => void
}

class ChalkboardStateImpl implements ChalkboardState {
  
  open: boolean = false
  
  constructor() {
    makeObservable(this, {
      open: observable,
      setOpen: action.bound 
    })
  }

  setOpen(b: boolean) { this.open = b }
}

export { type ChalkboardState as default, ChalkboardStateImpl}
