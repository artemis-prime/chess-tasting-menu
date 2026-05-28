import { useEffect, useRef } from 'react'
import { action, autorun, computed, makeObservable, observable } from 'mobx'

import { type MediaQuery } from './media.stitches'
import { media } from './stitches.config'

class Query {

  query: MediaQuery
  ml: MediaQueryList 
  match: boolean 

  constructor(query: MediaQuery) {

    makeObservable(this, {
      match: observable,
      listener: action.bound
    })

    this.query = query
    this.ml = matchMedia(media[query])
    this.match = this.ml.matches
  }

  startListening() {
    this.ml.addEventListener('change', (ev: MediaQueryListEvent) => {this.listener(ev)})
  }

  listener(ev: MediaQueryListEvent): any  {
    this.match = (this.ml!.matches) 
  }

  stopListening() {
    this.ml!.removeEventListener('change', this.listener!)
  }
}

interface LargestQuery {
  get largest(): MediaQuery | null
}

class LargestQueryImpl implements LargestQuery {

  private _largest: MediaQuery | null = null

  constructor() {
    makeObservable(this, {
      largest: computed,
      setLargest: action
    })
    makeObservable<LargestQueryImpl, '_largest'>(this, {
      _largest: observable,
    })
  }

  setLargest(m: MediaQuery | null): void {
    this._largest = m
  }

  get largest(): MediaQuery | null {
    return this._largest
  }
}

const useLastQuery = (
  queries: MediaQuery[],
): LargestQuery => {

  const queriesRef = useRef<Query[]>([])
  const lastRef = useRef<LargestQueryImpl>(new LargestQueryImpl())

  useEffect(() => {
    if (queriesRef.current.length === 0) {
      queries.forEach((query) => {
        queriesRef.current.push(new Query(query))    
      })
    }
    const autorunDisposer = autorun(() => {
      lastRef.current.setLargest(null)
      for (let i = queriesRef.current.length - 1; i >=0; i--) {
        if (queriesRef.current[i].match) {
          lastRef.current.setLargest(queriesRef.current[i].query)
          break 
        }
      }
    })
      // Should happen after autorun() because we want to 
      // dereference each 'match' the first time.
    queriesRef.current.forEach((q) => {q.startListening()})
    return () => { 
      queriesRef.current.forEach((q) => {q.stopListening()})
      autorunDisposer()
    }
  }, [])

  return lastRef.current
}

export default useLastQuery
