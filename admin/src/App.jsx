import { useState } from 'react'
import Direction from './Direction'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Direction/>  
    </>
  )
}

export default App
