import React, { type PropsWithChildren } from 'react'

import type { GameSnapshot } from '@artemis-prime/chess-core'

interface SnapshotPersistenceService {
  save: (s: GameSnapshot, defaultFilename: string) => void
  get: (loaded: (s: GameSnapshot) => void, error: (e: string) => void) => void
}

const SnapshotPersistenceContext = React.createContext<SnapshotPersistenceService | undefined>(undefined) 

const SnapshotPersistenceProvider: React.FC<PropsWithChildren> = ({ 
  children 
}) => {

  const save = (gs: GameSnapshot, defaultFilename: string): void => {

    const gsjson = JSON.stringify(gs)
    const bytes = new TextEncoder().encode(gsjson)
    const blob = new Blob([bytes], {type: "application/json;charset=utf-8"})
    const dataURI = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = defaultFilename
    link.href = dataURI
    link.click()
  }
  

  const get = (loaded: (s: GameSnapshot) => void, error: (e: string) => void): void => {

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => { 
      const text = (e.target?.result)
      if (text && typeof text === 'string') {
        const g: any = JSON.parse(text as string)
        if (g.artemisPrimeChessGame) {
          loaded(g)
        }
        else {
          error('Chess: unrecognized file format')
        }
      }
      else {
        error('Chess: File parse error')
      }
        // TODO
        // Allow the same file to be selected consecutively. 
        // https://github.com/ngokevin/react-file-reader-input/issues/11
      //originalEvent.target.value = ''
    }
    reader.onerror = (e: ProgressEvent<FileReader>) => {
      error("SnapshotPersistenceProvider.read(): File Error!") 
    }

    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.onchange = (e: Event) => {
      reader.readAsText((e.target as any).files[0])
    }
    fileInput.click()
  }

  return (
    <SnapshotPersistenceContext.Provider value={{save, get}}>
      {children}
    </SnapshotPersistenceContext.Provider>
  )
}

export {
  SnapshotPersistenceProvider as default,
  SnapshotPersistenceContext,
  type SnapshotPersistenceService
}
 