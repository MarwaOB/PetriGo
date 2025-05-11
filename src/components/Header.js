import React from 'react';
import { FaFileExport, FaMoon } from 'react-icons/fa';

const Header = () => {
  return (
    <div className='flex justify-between items-center h-12 mx-auto px-4 bg-primaryBlue'>
      <h1 className='text-lg font-bold text-white flex-shrink-0'>Logo.</h1>
      <ul className='flex items-center space-x-4'>
        <li className='text-primaryYellow cursor-pointer border border-solid border-primaryYellow py-1 px-3 rounded-2xl'>Guide</li>
        <li className='w-8 h-8 bg-primaryYellow rounded-xl cursor-pointer flex items-center justify-center'>
          <FaFileExport style={{ color: '#2B82FB' }} />
        </li>
        <li className='w-8 h-8 bg-primaryYellow rounded-xl cursor-pointer flex items-center justify-center'>
          <FaMoon style={{ color: '#2B82FB' }} />
        </li>
      </ul>
    </div>
  );
};

export default Header;
