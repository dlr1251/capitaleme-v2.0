import { useState } from 'react';

const Navbar = ({ lang, pathname }) => {
  const getEnglishURL = (path) => (path?.startsWith('/') ? path.substring(3) : path); 
  const getSpanishURL = (path) => (path?.startsWith('/es') ? path : `/es${path}`); 

  const engURL = getEnglishURL(pathname);
  const espURL = getSpanishURL(pathname);
  
  const links = [
    { href: lang === 'en' ? '/about' : '/es/about', text: lang === 'en' ? 'About Us' : 'Nosotros' },
    { href: lang === 'en' ? '/visas' : '/es/visas', text: lang === 'en' ? 'Visas & Immigration' : 'Visas Colombianas' },
    { href: lang === 'en' ? '/real-estate' : '/es/real-estate', text: lang === 'en' ? 'Real Estate' : 'Inmobiliario' },
    { href: lang === 'en' ? '/resources' : '/es/resources', text: lang === 'en' ? 'Resources' : 'Recursos' },
    { href: lang === 'en' ? '/blog' : '/es/blog', text: lang === 'en' ? 'News' : 'Blog' },
    { href: lang === 'en' ? '/contact' : '/es/contact', text: lang === 'en' ? 'Hire us' : 'Contacto' },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#fbfbfb] border-gray-200 fixed w-full z-50 top-0 shadow md:shadow-lg">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <a href={lang === 'es' ? '/es' : '/'} className="px-0 w-1/3 md:w-auto flex items-center">
          <img
            src={ lang === 'en' ? '../../src/assets/logo/color-horizontal.svg' : '../../../src/assets/logo/color-horizontal.svg'}
            loading="eager"
            alt="Capital M Logo"
            className="h-8 md:mr-3"
            width={100}
          />
        </a>

        {/* Desktop menu */}
        <div id="mega-menu" className="hidden md:flex md:w-auto order-3 md:order-1">
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-6 rtl:space-x-reverse">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`block py-2 px-3 text-primary border-b border-gray-100 md:border-0 md:hover:text-secondary md:hover:underline md:p-0 ${
                    pathname === link.href ? 'text-primary border border-b-4' : ''
                  } ${pathname?.includes(link.href) && link.href !== '/' ? 'text-secondary border border-b-4' : ''}`}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Language switcher */}
        <div className="relative inline-block text-left order-2 md:order-2">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            {lang === 'es' ? 'Español' : 'English'}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div
              className="z-10 absolute right-0 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <a
                  href={engURL}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  role="menuitem"
                >
                  English
                </a>
                <a
                  href={espURL}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  role="menuitem"
                >
                  Español
                </a>
              </div>
            </div>
          )}
        </div>

         {/* Hamburger button for mobile */}
         <button
          type="button"
          className="md:hidden inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 order-3 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            // Close icon (X)
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          ) : (
            // Hamburger icon
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd"/>
            </svg>
          )}
        </button>
        
      </div>

      

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <ul className="flex flex-col p-4 mt-4 space-y-2 border-t border-gray-200">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`block py-2 px-3 text-primary border-b border-gray-100 ${
                    pathname === link.href ? 'text-primary border border-b-4' : ''
                  } ${pathname?.includes(link.href) && link.href !== '/' ? 'text-secondary border border-b-4' : ''}`}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
