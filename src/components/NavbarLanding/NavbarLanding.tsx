import { NavLink } from 'react-router-dom'
import style from './NavbarLanding.module.css'
import { useState, useEffect } from 'react';
import Logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthContext } from '../../context/AuthContext';



function NavbarLanding() {

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [, setIsMobile] = useState<boolean>(false)
  const navigate = useNavigate()

  //used to have the hamburger menu closed if the window is small and the navbar is hamburger
  const showMenuStyle = {
    display: window.innerWidth > 600 ? "flex" : showMenu ? "flex" : "none"
  }

  const hamburgerMenuColor = {
    color: showMenu ? "var(--secondary)" : "var(--main)"
  }

  const handleHamburgerClick = () => {
    setShowMenu(!showMenu)
  }

  const handleResize = () => {
    if(window.innerWidth <= 600) {
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
      <div className={style.hamburgerMenu} onClick={handleHamburgerClick}>
        <MenuIcon style={hamburgerMenuColor}></MenuIcon>
      </div>
      <div className={style.navbarContainer} style={showMenuStyle}>
      <img className={style.logo} src={Logo} alt="logo" onClick={() => {navigate("/")}}/>

        <div className={style.nameContainer}>
          <div className={style.wrapperName}>
            <button className='full-button-small' onClick={() => navigate("/today")}>Dashboard</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NavbarLanding