import { NavLink } from 'react-router-dom'
import style from './Navbar.module.css'
import { useState, useEffect } from 'react';
import Logo from '../../assets/logo-low.png';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthContext } from '../../context/AuthContext';

type NavbarProps =  {
  showAllOptions: boolean
}

function Navbar({showAllOptions}: NavbarProps) {

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [, setIsMobile] = useState<boolean>(false)
  const navigate = useNavigate()
  const context = useAuthContext();
  const userName = context.currentUserDataDb!.name

  //used to have the hamburger menu closed if the window is small and the navbar is hamburger
  const showMenuStyle = {
    display: window.innerWidth > 1000 ? "flex" : showMenu ? "flex" : "none"
  }

  const hamburgerMenuColor = {
    color: showMenu ? "var(--orange)" : "var(--black)"
  }

  const handleHamburgerClick = () => {
    setShowMenu(!showMenu)
  }

  const handleResize = () => {
    if(window.innerWidth <= 1000) {
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
      <div className={style.hamburgerMenu} onClick={handleHamburgerClick}><MenuIcon style={hamburgerMenuColor}></MenuIcon></div>
      <div className={style.navbarContainer} style={showMenuStyle}>
      <img className={style.logo} src={Logo} alt="logo" onClick={() => {navigate("/")}}/>
        {showAllOptions && <div className={style.linksContainer}>

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
        </div>}

        <div className={style.nameContainer}>
          <NavLink
            to="/account" 
            className={({ isActive }) =>
            isActive ? style.active : style.inactive}>
              {userName}
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Navbar