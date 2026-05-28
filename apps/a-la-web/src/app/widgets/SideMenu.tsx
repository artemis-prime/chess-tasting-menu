import React from 'react'
import { observer } from 'mobx-react-lite'

import type { GameSnapshot } from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/style'
import { useChessboardOrientation, useChess, useSnapshotPersistence } from '~/services'
import { Drawer, type IconAndStyles } from '~/primatives'

import {
  MenuItem,
  MenuSectionTitle,
  MenuCheckboxItem
} from './menu/side'

import menuIcons from './menu/menuIcons'

  // Following this: 
  // https://m3.material.io/components/navigation-drawer/specs
const MenuRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  w: '100%', 
  h: '100%', 
  p: '12px', // Spec: 28 to icon - 16 within button
  backgroundColor: '$menuBGColor', 
  color: '$menuTextColor',

  '& hr': {
    mx: '$menuPL',
    width: 'auto',
    opacity: 0.5,
  },

  '@headerStaging': {display: 'none'}
})

const SideMenu: React.FC<{
  open: boolean
  css?: CSS
}> = observer(({
  open,
  css
}) => {

  const bo = useChessboardOrientation()
  const sp = useSnapshotPersistence()
  const game = useChess()

  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }
  const saveSnapshot = () => {
    const gs = game.takeSnapshot()
    sp.save(gs, 'game.json')
  }
  
  const restoreSnapshot = () => { 
    sp.get(
      (snapshot: GameSnapshot) => { game.restoreFromSnapshot(snapshot) },
      (error: string) => { console.warn(error) }
    )
  }

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <Drawer side='left' open={open} css={css}>
      <MenuRoot >
        <MenuSectionTitle>Direction</MenuSectionTitle>
        <hr />
        <MenuItem onClick={swapDirection} disabled={bo.autoOrientToCurrentTurn} icon={menuIcons.swap} >swap</MenuItem>
        <MenuCheckboxItem 
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn}
          icon={menuIcons.autoSwap}
        >auto-swap</MenuCheckboxItem>
        <MenuSectionTitle>Game</MenuSectionTitle>
        <hr />
        {(game.playing) && (<>
          <MenuItem onClick={game.offerADraw} icon={menuIcons.draw}>offer a draw</MenuItem>
          <MenuItem onClick={game.concede} icon={{icon: currentConcedes, style: (menuIcons.concede as IconAndStyles).style}}>{game.currentTurn} concedes</MenuItem>
        </>)}
        <MenuItem onClick={game.reset} icon={menuIcons.reset}>reset</MenuItem>
        <hr />
        <MenuItem onClick={saveSnapshot} icon={menuIcons.saveGame} >save game...</MenuItem>
        <MenuItem onClick={restoreSnapshot} icon={menuIcons.restoreGame} >restore game...</MenuItem>
      </MenuRoot>
    </Drawer>
  )
})

export default SideMenu
