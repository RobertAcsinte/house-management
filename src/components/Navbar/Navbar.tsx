import { NavLink } from 'react-router-dom'
import style from './Navbar.module.css'
import UserIcon from '../../assets/user_icon.svg';
import HamburgerMenu from '../../assets/hamburger_menu.svg'
import { useState, useEffect } from 'react';

type NavbarProps =  {
  userName: string | null
}

function Navbar({userName}: NavbarProps) {

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [, setIsMobile] = useState<boolean>(false)


  const display = window.innerWidth > 780 ? "flex" : showMenu ? "flex" : "none"

  const showMenuStyle = {
    display: display
  }

  const handleHamburgerClick = () => {
    setShowMenu(!showMenu)
  }

  const handleResize = () => {
    if(window.innerWidth < 780) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <div className={style.hamburgerMenu} onClick={handleHamburgerClick}><img className={style.hambuerMenuIcon} src={HamburgerMenu} alt="logo" /></div>
      <div className={style.navbarContainer} style={showMenuStyle}>
        <div className={style.linksContainer}>

          <NavLink
          to="/" 
          className={({ isActive }) =>
          isActive ? style.active : style.inactive}>
            Today
          </NavLink>

          <NavLink
          to="/notes" 
          className={({ isActive }) =>
          isActive ? style.active : style.inactive}>
            Notes
          </NavLink>

          <NavLink
          to="/kitchen" 
          className={({ isActive }) =>
          isActive ? style.active : style.inactive}>
            Kitchen
          </NavLink>

          <NavLink
          to="/bathroom" 
          className={({ isActive }) =>
          isActive ? style.active : style.inactive}>
            Bathroom
          </NavLink>

          <NavLink
          to="/myhouse" 
          className={({ isActive }) =>
          isActive ? style.active : style.inactive}>
            My House
          </NavLink>
        </div>

        <NavLink
          to="/account" 
          className={({ isActive }) =>
          isActive ? style.active : style.inactive}>
            <div className={style.accountImageContainer}>
              <img className={style.userIcon} src={UserIcon} alt="logo" />
              {userName}
            </div>
          </NavLink>
      </div>
    </>
  )
}

export default Navbar