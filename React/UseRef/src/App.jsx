import { useState,useEffect,useRef } from "react";
import "./App.css";

function App() {
  // const [inputField, setInputField] = useState("");
  // const inputUseRef = useRef(0);

  // useEffect(() => {
  //   inputUseRef.current=inputUseRef.current+1
  // })
  // return (
  //   <>
  //     <h1>USE REF HOOKS</h1>
  //     <h3>Input Field Here</h3>
  //     <input type="text" value={inputField} onChange={(e)=>setInputField(e.target.value)} />
  //     <h3>Render {inputUseRef.current}</h3>


  const [inputText, setInputText] = useState("")
  const previousInputText = useRef("")
  useEffect(() => {
    previousInputText.current = inputText;
  }, [inputText]);
  return (
    <>
      <h2>Input Here</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <h2>Current Input: {inputText}</h2>
      <h2>Previous Input: {previousInputText.current}</h2>
    </>
  );}

export default App;
