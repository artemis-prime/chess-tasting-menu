import React, { useEffect, type PropsWithChildren } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import SwitchFromLib from 'react-switch'

import { styled, type CSS, useLastQuery } from '~/style'

const SwitchLabel = styled('label', {
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',
  gap: '0.5em',
  '.my-switch': {
    display: 'block'
  },
  'span': {
    fontSize: 'inherit',
    display: 'block'
  },
  '.react-switch-bg': {
    borderRadius: '0.5em !important',
    border: '0.5px #777 solid !important',
  },
  '.react-switch-handle': {
    border: '1.5px solid #777 !important'
  }
})

const Switch: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void,
  disabled?: boolean,
  css?: CSS
} & PropsWithChildren> = observer(({
  checked,
  onChange,
  children,
  disabled = false,
  css
}) => { 


  const l = useLastQuery([
    'deskSmallest',
    'deskSmall',
    'menuBreak',
  ])

  /*
  useEffect(() => {
    return autorun(() => {
      console.log(' LAST: ' + l.largest)
    })
  }, [])
  */


  let sizes: {
    height: number
    width: number
    handleDiameter: number | undefined
  } = {
    height: 16,
    width: 44,
    handleDiameter: 22
  }

  if (l.largest === 'deskSmallest') {
    sizes = {
      height: 10,
      width: 30,
      handleDiameter: 12
    }  
  }

  //console.log(JSON.stringify(sizes, null, 2))

  return (
    <SwitchLabel css={css}>
      <span>{children}</span>
      <SwitchFromLib 
        className='my-switch' 
        checked={checked} 
        onChange={onChange}
        height={sizes.height}  
        width={sizes.width}  
        handleDiameter={sizes.handleDiameter} 
        onColor='#005800'
        onHandleColor='#a76b37'
        activeBoxShadow='0 0 2px 3px rgba(100, 100, 100, 0.5)'
        disabled={disabled}
      />
    </SwitchLabel>
  )
})

export default Switch
