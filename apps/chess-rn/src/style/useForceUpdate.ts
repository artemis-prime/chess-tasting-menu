import { useState } from 'react'

// https://stackoverflow.com/questions/46240647/how-to-force-a-functional-react-component-to-render/53837442#53837442
const useForceUpdate = () => {

  const [value, setValue] = useState<number>(0) 
  return () => setValue((value) => (value + 1)) 
}

export default useForceUpdate