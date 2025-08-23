import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  // const [color, setColor] = useState("red")
  // return (
  //   <>
  //     <h1>USE STATE HOOKS</h1>
  //     <h2>Color: {color}</h2>
  //     <button onClick={()=>setColor("blue")}>Blue</button>
  //   </>
  // )

  const [count, setCount] = useState(0);
  const [calculation, setCalculation] = useState(0);

  const handleIncrement = () => {
    setCount((c) => c + 1);
  };
  const handleDecrement = () => {
    setCount((c) => (c > 0 ? c - 1 : 0));
  };

  useEffect(() => {
    setCalculation(() => count ** 2);
  }, [count]);
  return (
    <>
      <h1>USE EFFECT HOOKS</h1>
      <h2>Square Find Here</h2>

      <h2>Number: {count}</h2>
      <button onClick={handleIncrement}>Increment</button>

      <h2>Square: {calculation}</h2>
      <button onClick={handleDecrement}>Decrement</button>
    </>
  );
}

export default App;
