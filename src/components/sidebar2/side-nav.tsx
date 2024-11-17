"use client";

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


import { SIDENAV_ITEMS,SIDENAV_PUPIL_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';



interface userPayload {
  sub: number;
  username: string;
  rol: number;
  iat: number;
  exp: number;
}

const SideNav = () => {
  
  const [userData, setUserData] = useState<userPayload | null>(null);

  useEffect(()=>{
    const token = sessionStorage.getItem('access_token');

    if(token) {
      const decoded = jwtDecode<userPayload>(token);
      setUserData(decoded);
    }
  }, []);

  const sideNavItem = userData?.rol === 1 ? SIDENAV_ITEMS : SIDENAV_PUPIL_ITEMS;
    return (
        <div className="md:w-60 bg-white h-screen flex-1 fixed hidden md:flex">
            <div className="flex flex-col space-y-6 w-full bg-blue-500 text-white">
                <Link
                href="/"
                className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full bg-blue-500 text-white"
                >
                <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
                <span className="font-bold text-xl hidden md:flex">SharkCat</span>
                </Link>

                <div className="flex flex-col space-y-2  md:px-6">
                {sideNavItem.map((item, idx) => {
                    return <MenuItem key={idx} item={item} />;
                })}
                </div>
            </div>
        </div>
    )
}

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
      setSubMenuOpen(!subMenuOpen);
    };
  
    return (
      <div className="">
        {item.submenu ? (
          <>
            <button
              onClick={toggleSubMenu}
              className={`flex flex-row items-center p-2 rounded-lg hover-bg-blue-100 w-full justify-between hover:bg-blue-700 `}
            >
              <div className="flex flex-row space-x-4 items-center">
                {item.icon}
                <span className="font-semibold text-xl  flex">{item.title}</span>
              </div>
  
              <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                <Icon icon="lucide:chevron-down" width="24" height="24" />
              </div>
            </button>
  
            {subMenuOpen && (
              <div className="my-2 ml-12 flex flex-col space-y-4">
                {item.subMenuItems?.map((subItem, idx) => {
                  return (
                    <Link
                      key={idx}
                      href={subItem.path}
                      className={`${
                        subItem.path === pathname ? 'font-bold' : ''
                      }`}
                    >
                      <span>{subItem.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-blue-700 `}
          >
            {item.icon}
            <span className="font-semibold text-xl flex">{item.title}</span>
          </Link>
        )}
      </div>
    );
  };