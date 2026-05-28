import { Dimensions, StatusBar } from 'react-native'
import { makeObservable, observable, action, computed } from 'mobx'

  // RN doesn't successfully export this... dunno wtf.
  // import { EmitterSubscription } from 'react-native/types'
  // TODO: submit issue and PR to RN repo for this issue!
interface EmitterSubscription {
  remove: () => void
}

interface ViewportState {
  get w(): number
  get h(): number
  get statusBarHeight(): number
  get landscape(): boolean
  setStatusBarHeight: (n: number) => void
  get hasStatusBarHeight(): boolean
}

class ViewportStateImpl implements ViewportState {

  private _w: number
  private _h: number

  private _sb: {
    portrait: number
    landscape: number
  } = {
    portrait: -1,
    landscape: -1
  }
  
  private _sub : EmitterSubscription | null = null

  constructor() {
    const dim = Dimensions.get('screen')
    this._w = dim.width
    this._h = dim.height

    const ls = dim.width > dim.height
    if (ls) {
      this._sb.landscape = StatusBar.currentHeight!
    }
    else {
      this._sb.portrait = StatusBar.currentHeight!
    }

    makeObservable(this, {
      w: computed,
      h: computed,
      landscape: computed,
      statusBarHeight: computed,
      hasStatusBarHeight: computed,
      setStatusBarHeight: action
    })
    makeObservable<ViewportStateImpl, '_w' | '_h' | '_sb' >(this, {
      _w: observable,
      _h: observable,
      _sb: observable.deep,
    })
  }

  get w(): number { return this._w }
  get h(): number { return this._h }
  get statusBarHeight(): number { 
    const fieldName = this.landscape ? 'landscape' : 'portrait'
    return (this._sb[fieldName] === -1) ? StatusBar.currentHeight! : this._sb[fieldName]
  }
  get landscape(): boolean { return (this._w > this._h) }

  setStatusBarHeight(n: number): void { 
    this._sb[this.landscape ? 'landscape' : 'portrait'] = n
  }

  get hasStatusBarHeight(): boolean {
    return this._sb[this.landscape ? 'landscape' : 'portrait'] !== -1
  }

  initialize() {
    const fieldName = this.landscape ? 'landscape' : 'portrait'
    if (this._sb[fieldName] === -1 && StatusBar.currentHeight) {
      this._sb[fieldName] = StatusBar.currentHeight
    } 
    this._sub = Dimensions.addEventListener('change', 
      action(({ screen }) => {
        this._w = screen.width
        this._h = screen.height
      })
    ) 
  }

  dispose() { this._sub?.remove() }
}

export {
  type ViewportState as default,
  ViewportStateImpl
}
