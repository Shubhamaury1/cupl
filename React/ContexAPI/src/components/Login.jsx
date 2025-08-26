import React, { useState,useContext, useEffect } from 'react'
import UserContext from '../context/UserContext';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState("");
    
   //important line
    const { setUser } = useContext(UserContext);

  //Local storage Implement
  useEffect(() => {
    const Savedusername = localStorage.getItem("Username")
    const Savedpassword = localStorage.getItem("Password");
    if (Savedusername) setUsername(Savedusername);
    if (Savedpassword) setPassword(Savedusername);
  }, [])
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      localStorage.setItem("Username", username);
      localStorage.setItem("Password", password);
      
      setUser({ username, password })
      
      setUsername("");
      setPassword("");
    }
  return (
    <>
      <div>
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
{" "}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}

export default Login