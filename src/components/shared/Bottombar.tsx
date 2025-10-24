import { bottombarLinks } from '@/constants';
import React from 'react'
import { Link , useLocation } from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation() ;
  return (
    <section className='bottom-bar'>
        {bottombarLinks.map((links) => {
          const isActive = pathname === links.route ;

          return (
              <Link 
                to={links.route}
                key={links.label}
                className={`flex-center flex-col gap-1 p-2 transition ${
                  isActive && 'bg-primary-500 rounded-[10px]'
                }`}
              >
                <img 
                  src={links.imgURL} 
                  alt={links.label}
                  width={16}
                  height={16}
                  className={`${
                    isActive && 'invert-white'
                  }`}
                />
                <p className='tiny-medium text-light-2'>{links.label}</p>
              </Link>
          )
        })}
    </section>
  )
}

export default Bottombar
