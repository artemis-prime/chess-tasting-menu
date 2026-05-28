import React from 'react'
import { observer } from 'mobx-react-lite'

import { Box } from '~/primatives'
import { useTransientMessage } from '~/services'

const TransientMessage: React.FC = observer(() => {

  const tm = useTransientMessage()
  return tm.message ? (
    <Box css={{
      color: tm.message.type.includes('warning') ? '$alert8' : '$chalkboardTextColor'
    }}>{tm.message.content}</Box> 
  ) : null
})

export default TransientMessage
