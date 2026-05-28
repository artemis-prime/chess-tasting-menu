import React, { type PropsWithChildren } from 'react'

import DomainProvider from './DomainProvider'
import UIServicesProvider from './UIServicesProvider'
import SnapshotPersistenceProvider from './SnapshotPersistenceProvider'

const Services: React.FC<PropsWithChildren> = ({
  children
}) => (
  <DomainProvider >
    <UIServicesProvider >
      <SnapshotPersistenceProvider>
        {children}
      </SnapshotPersistenceProvider>
    </UIServicesProvider>
  </DomainProvider>
)

export default Services
