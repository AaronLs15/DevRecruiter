// src/components/Header.jsx
import React, { useContext } from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const baseNavigation = [
  { name: 'Inicio', to: '/Inicio' },
  { name: 'Chat', to: '/Chat' },
  { name: 'Recursos', to: '/Recursos' },
  { name: 'Integración Laboral', to: '/IntegracionLaboral' },
  
];
const userNavigation = [
  { name: 'Perfil', href: '/Perfil' },
  { name: 'Cerrar Sesión', href: '/Login' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header({ isOpen, showSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determinar links según estado y rol
  const navigation = React.useMemo(() => {
    if (!user) {
      return [{ name: 'Inicio', to: '/Inicio' }];
    }
    if (user.role === 'Aspirante') {
      return baseNavigation.filter(item => item.name !== 'Integración Laboral');
    }
    if (user.role === 'Empleador') {
      return baseNavigation.filter(item => item.name !== 'Chat');
    }
    return baseNavigation;
  }, [user]);

  // Iniciales para avatar
  const initials = user
    ? user.name
    : '';

  const UserMenu = () => {
    if (!user) {
      return (
        <button
          onClick={() => navigate('/Login')}
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Iniciar Sesión
        </button>
      );
    }
    return (
      <Menu as="div" className="relative ml-3">
        <MenuButton className="flex items-center text-sm focus:outline-none">
          {/*<div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-medium">
            {initials}
          </div>*/}
          <div className="ml-3 text-left">
            <div className="text-base font-medium text-white">{user.name}</div>
            <div className="text-sm font-medium text-gray-400">{user.email}</div>
          </div>
        </MenuButton>
        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          {userNavigation.map(item => (
            <MenuItem key={item.name}>
              {({ active }) => (
                <button
                  onClick={() => {
                    if (item.name === 'Cerrar Sesión') {
                      logout();
                      navigate('/Login');
                    } else {
                      navigate(item.href);
                    }
                  }}
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'w-full text-left px-4 py-2 text-sm text-gray-700'
                  )}
                >
                  {item.name}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    );
  };

  return (
    <div className="w-full border-b border-black">
      <Disclosure as="nav" className="bg-gray-800">
        <div
          className={classNames(
            'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300',
            showSidebar ? (isOpen ? 'pl-64' : 'pl-20') : 'pl-0'
          )}
        >
          <div className="flex h-16 items-center justify-between">
            {/* Navegación principal */}
            <div className="flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Menú usuario */}
            <div className="hidden md:flex items-center md:ml-6">
              <UserMenu />
            </div>

            {/* Botón mobile */}
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                <Bars3Icon className="h-6 w-6 group-data-open:hidden" aria-hidden="true" />
                <XMarkIcon className="hidden h-6 w-6 group-data-open:block" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden bg-gray-800">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-4 pb-3 px-5 flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-medium">
                    {initials}
                  </div>
                  <div className="ml-3 text-base font-medium text-white">{user.name}</div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/Login'); }}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/Login')}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
