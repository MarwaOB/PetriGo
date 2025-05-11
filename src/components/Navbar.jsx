import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faHandPointer, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faPaste, faPause, faPlay, faRotateLeft, faRotateRight, faXmark, faRectangleTimes, faCircle, faCircleDot, faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';


import { Link } from 'react-router-dom';
import './Navbar.css';

import { SidebarData } from './SidebarData.js';

// icons doesnt exist in fontawsome
import { FaRegCircle } from "react-icons/fa";
import { TbRectangleVertical } from "react-icons/tb";

import { TbRectangleVerticalFilled } from "react-icons/tb";

import { VscSearch } from "react-icons/vsc";
import { FiArrowUpRight } from "react-icons/fi";
import { PiCirclesFourFill } from "react-icons/pi";






//---------------------------------------------------

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            {/* Adjust the following line to use the FontAwesome icon */}
            <FontAwesomeIcon icon={faBars} style={{ color: '#2B82FB' }} onClick={showSidebar} />
          </Link>
          <div className='w-3/4 ml-28 bg-primaryBlue h-7 rounded-3xl flex justify-center items-center gap-16'>
            {/* Group 1 */}
            <div className="flex items-center space-x-2 gap-1">
              <FaRegCircle style={{ color: 'white' }} />
              <TbRectangleVerticalFilled style={{ color: 'white' }} />
              <TbRectangleVertical style={{ color: 'white' }} />
              <PiCirclesFourFill style={{ color: 'white' }} />  
              <VscSearch style={{ color: 'white' }} />
              <FiArrowUpRight style={{ color: 'white' }} />

            </div>

            {/* Group 2 */}
            <div className="flex items-center space-x-2 gap-1">
              <FontAwesomeIcon icon={faPause} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faPlay} style={{ color: 'white' }} />
            </div>

            {/* Group 3 */}
            <div className="flex items-center space-x-2 gap-1">
              <FontAwesomeIcon icon={faXmark} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faHandPointer} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faRotateRight} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faRotateLeft} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faCopy} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faPaste} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} style={{ color: 'white' }} />
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} style={{ color: 'white' }} />
            </div>
          </div>
        </div>
       
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            {SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
