import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import 'tailwindcss/tailwind.css';
import Home from './pages/Home.js';
import Navbar from './pages/Navbar.jsx';
import Documentation from './pages/Documentation.js';
import NoPage from './pages/NoPage.js';
import AboutUs from './pages/AboutUs.js';



function App() {
  return (
    <Provider store={store}>
      <div>
        <BrowserRouter>
            <Routes>
            <Route index element={<Home/>} />
            <Route  element={<Home/>} />
          <Route path="/Simulation" element={<Navbar/>} />
      <Route path="/Documentation" element={<Documentation/>} />
         
          <Route path="/About-us" element={<AboutUs/>} />
            <Route path="*" element={<NoPage/>} /> 
            </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
