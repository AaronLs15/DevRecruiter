// src/components/Header.jsx
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import useUserData from '../Hooks/chat/useUserData';

const navigation = [
  { name: 'Inicio', to: '/' },
  { name: 'Chat', to: '/Chat' },
  { name: 'Recursos', to: '/Recursos' },
  { name: 'IntegracionLaboral', to: '/IntegracionLaboral' },
];

const userNavigation = [
  { name: 'Perfil', href: '#' },
  { name: 'Cerrar Sesión', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header({ isOpen }) {
  const { userData } = useUserData();

  const user = userData && Array.isArray(userData) && userData.length > 0
    ? {
        name: userData[0].Nombre_usuario || '',
        email: userData[0].Email || '',
      }
    : {
        name: 'Cargando...',
        email: 'Cargando...',
      };

  const initials = (user.name || '')
    .split(' ')
    .map(n => n.charAt(0))
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} border-b border-black rounded-r-lg`}>
      <Disclosure as="nav" className="bg-gray-800 rounded-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Navegación principal */}
            <div className="flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
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

            {/* Icono de notificaciones + menú de usuario (desktop) */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/*<button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                >
                  <span className="sr-only">Ver notificaciones</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>
                */}
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Abrir menú del perfil</span>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-medium">
                      {initials}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user.name}</div>
                      <div className="text-sm font-medium text-gray-400">{user.email}</div>
                    </div>
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>

            {/* Botón mobile para abrir/cerrar menú */}
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                <span className="sr-only">Abrir menú principal</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* Panel mobile */}
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => (
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
          <div className="border-t border-gray-700 pt-4 pb-3">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-medium">
                  {initials}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user.name}</div>
              </div>
              <button
                type="button"
                className="ml-auto rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <span className="sr-only">Ver notificaciones</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
