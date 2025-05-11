import React, { useState } from 'react';
import './Canvas.css'; 

// import { Navbar } from './Navbar';
/*
const Canvas = () => {
  const [sidebar, setSidebar] = useState(false);

  const toggleMenu = () => {
    setSidebar(!sidebar);
  };

return (
  <div className={`flex ${sidebar ? 'ml-64' : 'ml-0'}`}>
     { Your Canvas Content }
    <div className={` bg-secondaryBlue h-full flex-grow ${sidebar ? 'w-3/4' : 'w-full'}`}>
      <div className ='bg-secondaryBlue'></div>
    </div>
    </div>
);
};*/ 

const Canvas = () => {
  return (

    
      <div className='canvas'></div>
    
  );
};

export default Canvas ; 