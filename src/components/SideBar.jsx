import React from 'react'
import { FaBars, FaBook } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'

const MenuItem = [
  { Titulo: 'Historial1', Ruta: '#', current: false },
  { Titulo: 'Historial2', Ruta: '#', current: false },
]

const SideBar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-800 transition-all duration-300 text-white border-r border-black ${isOpen ? "w-64" : "w-20"} rounded-r-lg`}>
      <div className='flex justify-between items-center p-4'>
        <h2 className={`text-xl font-bold font-sans ${isOpen ? "block" : "hidden"}`}>
          Historial
        </h2>
        <button className='block' onClick={toggleSidebar}>
          {isOpen ? <IoCloseSharp size={24}/> : <FaBars size={24} />}
        </button>
      </div>

      <nav className='mt-4'>
        <ul>
          {MenuItem.map((item) => (
            <li key={item.Titulo} className='flex font-semibold items-center p-5 hover:bg-gray-700 cursor-pointer'>
              <FaBook size={24} />
              <a 
                className={`ml-4 ${isOpen ? "block" : "hidden"}`}
                href={item.Ruta}
              >
                {item.Titulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default SideBar
