import { NavLink } from 'react-router-dom'
import style from './Navbar.module.css'
import { useState, useEffect } from 'react';
import Logo from '../../assets/logo-low.png';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

type NavbarProps =  {
  userName: string | null
}

function Navbar({userName}: NavbarProps) {

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [, setIsMobile] = useState<boolean>(false)
  const navigate = useNavigate()

  const showMenuStyle = {
    display: window.innerWidth > 945 ? "flex" : showMenu ? "flex" : "none"
  }

  const hamburgerMenuColor = {
    color: showMenu ? "var(--orange)" : "var(--black)"
  }

  const handleHamburgerClick = () => {
    setShowMenu(!showMenu)
  }

  const handleResize = () => {
    if(window.innerWidth < 945) {
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
            {userName}
          </NavLink>
      </div>
    </>
  )
}

export default Navbar