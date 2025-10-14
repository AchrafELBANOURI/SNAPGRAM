import { useEffect, useState } from 'react'
import { Link , NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/constants'
import type { INavLink } from '@/types'
import { Button } from '../ui/button'


const LeftSidebar = () => {
    const { pathname } = useLocation() ;
    const { mutate : signOut , isSuccess } = useSignOutAccount();   
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(()=>{
        if(isSuccess) navigate(0) ;
    },[isSuccess]);

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
          <Link to="/" className="flex gap-3 items-center">
              <img src="/assets/images/logo.svg" alt="Snapgram" width={170} height={36} />
          </Link>

          <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
            <img 
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} 
              alt="profile" 
              className='h-14 w-14 rounded-full' 
            />

            <div className='flex flex-col'>
              <p className='body-bold'>
                {user.name}
              </p>

              <p className='small-regular text-light-3'>
                @{user.username}
              </p>
            </div>
          </Link>

          <ul className='flex flex-col gap-6'>
            {sidebarLinks.map((links : INavLink) => {
              const isActive = pathname === links.route ;

              return (
                <li 
                  key={links.label} 
                  className={`leftsidebar-link ${
                    isActive && 'bg-primary-500'
                  }`}
                >
                  <NavLink to={links.route} className='flex group gap-4 items-center p-4'>
                    <img 
                      src={links.imgURL} 
                      alt={links.label}
                      className={`group-hover:invert-white ${
                        isActive && 'invert-white'
                      }`}
                    />
                    {links.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
      </div>
      

      <Button variant="ghost" className='shad-button_ghost' onClick={() => signOut()}>
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className='small-medium lg:base-medium'>Log out</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
