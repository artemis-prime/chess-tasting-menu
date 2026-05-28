import { useContext } from 'react'

import { SnapshotPersistenceContext, type SnapshotPersistenceService } from './SnapshotPersistenceProvider'

const useSnapshotPersistence = (): SnapshotPersistenceService =>  {
  return useContext(SnapshotPersistenceContext) as SnapshotPersistenceService
}

export default useSnapshotPersistence
