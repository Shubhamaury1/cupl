import { useState } from 'react'
// import Property from './components/Property'
import './App.css'

function App() {
  const [count, setCount] = useState("Hello Everyone")

  return (
    <>
      <h1>{count}</h1>
      <button onClick={()=>setCount("I am Good")}>Click Me</button>
        {/* <Property username={name}></Property> */}
    </>
  )
}

export default App
