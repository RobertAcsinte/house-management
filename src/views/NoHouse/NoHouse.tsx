import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import style from './NoHouse.module.css'

function NoHouse() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;

  return (
    <>
      <Navbar showAllOptions = {false}/>

      <div className='center-wrapper'>
        <div className={style.noHouseText}>Currently you are not part of any house!</div>
        <div className={style.container}>
          <div className={style.buttonContainer}>
            <button className='full-button' style={{marginRight: '20px'}}>Join an existing house</button>
            <button className='empty-button' style={{marginLeft: '20px'}}>Create a new house</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoHouse