import NavbarLanding from '../../components/NavbarLanding/NavbarLanding'
import style from './LandingPage.module.css'

function LandingPage() {
  return (
    <>
    <NavbarLanding />
    <div className='wrapper-content'>
      <div className={style.wrapperCenter}>
        <div className={style.motto}>
          <p>Effortless communication and coordination among housemates.</p>
        </div>
        <div className={style.mottoDescription}>
          <p>Experience hassle-free student living everywhere in the world with House Sharing! Our platform brings together housemates, making it a breeze to share notes and coordinate schedules for communal spaces. 
            Say goodbye to misunderstandings and hello to seamless housemate harmony!</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default LandingPage