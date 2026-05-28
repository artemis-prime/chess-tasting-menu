import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'

import type { GameSnapshot } from '@artemis-prime/chess-core'

import {type CSS } from '~/style'
import { 
  useChessboardOrientation, 
  useChess, 
  useSnapshotPersistence 
} from '~/services'
import type { IconAndStyles } from '~/primatives'

import {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger, 
  MenubarPopup,
  MenubarSeparator,
  MenubarItem,
  MenubarCheckboxItem,
} from './menu/main'

import menuIcons from './menu/menuIcons'

const AppMenubar: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const bo = useChessboardOrientation()
  const sp = useSnapshotPersistence()
  const game = useChess()

  const rootRef = useRef<HTMLDivElement>()

  /*
  useEffect(() => {

    const hideMenu = () => {
        // https://stackoverflow.com/questions/58773652/ts2339-property-style-does-not-exist-on-type-element
      const el = document.querySelector('[data-radix-popper-content-wrapper]')
      if (el) { (el as HTMLElement).style.display = 'none' }
      const trigger = document.querySelector('button[data-state=open]')
      if (trigger && trigger.id.includes('radix')) {
        (trigger as HTMLElement).setAttribute('data-state', 'closed');
        (trigger as HTMLElement).setAttribute('aria-expanded', 'false');
      }
    }
      // returning autorun's disposer as per mobx docs 
    return autorun(() => {
        // If we've just been resized down, manually hide the menu ("feature" of our menu lib)
      if (!deviceInfo.queryResult ) return;
      if (deviceInfo.isWithin(null, 'lsMenuBreak')) {
        hideMenu()
      }
    })
  }, [])
  */

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
    <MenubarRoot css={css}>
      <MenubarMenu>
        <MenubarTrigger>Game</MenubarTrigger>
        <MenubarPopup>
        {(game.playing) && (<>
          <MenubarItem onClick={game.offerADraw} icon={menuIcons.draw}>offer a draw</MenubarItem>
          <MenubarItem onClick={game.concede} icon={{icon: currentConcedes, style: (menuIcons.concede as IconAndStyles).style}}>{game.currentTurn} concedes</MenubarItem>
        </>)}
          <MenubarItem onClick={game.reset} icon={menuIcons.reset}>reset</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={saveSnapshot} icon={menuIcons.saveGame} >save game...</MenubarItem>
          <MenubarItem onClick={restoreSnapshot} icon={menuIcons.restoreGame} >restore game...</MenubarItem>
        </MenubarPopup>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Direction</MenubarTrigger>
        <MenubarPopup>
          <MenubarItem onClick={swapDirection} disabled={bo.autoOrientToCurrentTurn} icon={menuIcons.swap} >swap</MenubarItem>
          <MenubarCheckboxItem
            checked={bo.autoOrientToCurrentTurn} 
            onCheckedChange={bo.setAutoOrientToCurrentTurn}
            icon={menuIcons.autoSwap}
          >auto-swap</MenubarCheckboxItem>
        </MenubarPopup>
      </MenubarMenu>
    </MenubarRoot>
  )
})

export default AppMenubar