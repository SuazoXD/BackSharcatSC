"use client"

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="bg-blue-500 text-white fixed top-0 w-full z-10 absolute">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">SharkCat</Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Acerca</Link>
            
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/auth/login" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
            <Link href="/" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium">Acerca</Link>
          </div>
        </div>
      )}
    </nav>
    )
}

export default Navbar;