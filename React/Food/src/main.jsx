import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux"
import Store from './redux/Store.js'
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={Store}>
    <div className=" dark:bg-gray-900 h-auto sm:min-h-screen md:h-auto lg:min-h-screen">
      <App />
    </div>
  </Provider>
  //  </StrictMode>
);
