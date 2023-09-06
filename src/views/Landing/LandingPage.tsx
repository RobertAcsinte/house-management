import NavbarLanding from '../../components/NavbarLanding/NavbarLanding'
import style from './LandingPage.module.css'
import Logo from '../../assets/logo.svg';
import NoHouse from '../../assets/nohouse.png';
import Today from '../../assets/today.png';
import Notes from '../../assets/notes.png';
import Appointments from '../../assets/appointments.png';
import Myhouse from '../../assets/myhouse.png';

function LandingPage() {
  return (
    <>
    <NavbarLanding />
    <div className='wrapper-content' style={{marginBottom:"0"}}>
      <div className={style.wrapperCenter}>
        <div className={style.containerFeature}>
          <div className={style.title}>
            <p>Effortless communication and coordination among housemates.</p>
          </div>
          <div className={style.subTitle}>
            <p>Experience hassle-free student living everywhere in the world with House Sharing! Our platform brings together housemates, making it a breeze to share notes and coordinate schedules for communal spaces. 
              Say goodbye to misunderstandings and hello to seamless housemate harmony!</p>
          </div>
        </div>

        <div className={style.containerFeature} style={{background: "var(--secondary", color: "var(--background)"}}>
          <div className={style.title}>
            <p>Join a house</p>
          </div>
          <div className={style.subTitle}>
            <p>You can create a new house, join an existing house by it's id or get invited to one by an already existing user!</p>
          </div>
          <div className={style.imageContainer}>
            <img className={style.image} src={NoHouse} alt="logo"/>
          </div>
        </div>

        <div className={style.containerFeature}>
          <div className={style.title}>
            <p>See what's going on today</p>
          </div>
          <div className={style.subTitle}>
            <p>On the today page, you will always see the pinned notes of the house and the appointments that were made for the current day for the house facilities</p>
          </div>
          <div className={style.imageContainer}>
            <img className={style.image} src={Today} alt="logo"/>
          </div>
        </div>

        <div className={style.containerFeature} style={{background: "var(--secondary", color: "var(--background)"}}>
          <div className={style.title}>
            <p>Create notes for everyone</p>
          </div>
          <div className={style.subTitle}>
            <p>Do you have a package to receive and you want to let others know? Or is there an important announce to be made? Just create a note and it will be available for everyone. The pinned ones will always be on top and on Today page</p>
          </div>
          <div className={style.imageContainer}>
            <img className={style.image} src={Notes} alt="logo"/>
          </div>
        </div>

        <div className={style.containerFeature}>
          <div className={style.title}>
            <p>Make a reservation</p>
          </div>
          <div className={style.subTitle}>
            <p>Do you have classes in the morning and you don't know when to wake up to shower so you don't have to wait for others and be late? Or do you want to be sure that when you arrive home you will have time to cook? Book a timeslot. This way everyone
              can sync in using the shared facilities of the house!
            </p>
          </div>
          <div className={style.imageContainer}>
            <img className={style.image} src={Appointments} alt="logo"/>
          </div>
        </div>

        <div className={style.containerFeature} style={{background: "var(--secondary", color: "var(--background)"}}>
          <div className={style.title}>
            <p>Manage your house</p>
          </div>
          <div className={style.subTitle}>
            <p>
              You can always manage the house that you are part of. You can change the name of it, add members and see the pending invitations!
            </p>
          </div>
          <div className={style.imageContainer}>
            <img className={style.image} src={Myhouse} alt="logo"/>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}

export default LandingPage