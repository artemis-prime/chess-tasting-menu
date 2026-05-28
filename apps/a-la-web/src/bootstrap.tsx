import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '~/app/App'
import Services from '~/services/Services'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

  // https://patrickhlauke.github.io/touch/touchscreen-detection/
const detectTouchscreen = (): boolean => {
  let result = false
  if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
    // if Pointer Events are supported, just check maxTouchPoints
    if (navigator.maxTouchPoints > 0) {
      result = true
    }
  } 
  else {
    // no Pointer Events...
    if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
      // check for any-pointer:coarse which mostly means touchscreen
      result = true
    } 
    else if (window.TouchEvent || ('ontouchstart' in window)) {
      // last resort - check for exposed touch events API / event handler
      result = true
    }
  }
  return result
}

if (detectTouchscreen()) {
  document.addEventListener("contextmenu", (e) => {e.preventDefault()});
}

  // Keep in mind!: 
  // https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
root.render(
  <React.StrictMode>
    <Services>
      <App />
    </Services>
  </React.StrictMode>
)

