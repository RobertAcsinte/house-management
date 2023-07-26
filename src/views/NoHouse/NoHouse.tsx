import { useHouseContext } from '../../context/HouseContext';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import style from './NoHouse.module.css'
import { useState, useRef } from 'react';
import ModalSingleField from '../../components/ModalSingleField/ModalSingleField';

function NoHouse() {
  const houseContext = useHouseContext();
  const authContext = useAuthContext();
  
  const [showModal, setShowModal] = useState(false)

  const modal = useRef<JSX.Element | null>(null)

  const onNewHouse = () => {
    setShowModal(true)
    modal.current = <ModalSingleField modalTitle={'Create a house!'} fieldHint={'Enter the name of the house'} buttonText={'Create'} setShowModal={setShowModal} updateFunction={houseContext.createHouse}></ModalSingleField>
  }

  const onJoinHouse = () => {
    setShowModal(true)
    modal.current = <ModalSingleField modalTitle={'Join a house!'} fieldHint={'Enter the id of the house'} buttonText={'Join'} setShowModal={setShowModal} updateFunction={houseContext.joinHouse}></ModalSingleField>
  }


  return (
    <>
      <Navbar showAllOptions = {false}/>
        <div className='wrapper'>
          <div className={style.noHouseText}>Currently you are not part of any house!</div>
            <div className={style.buttonContainer}>
              <button className='full-button' style={{marginRight: '20px'}} onClick={onJoinHouse}>Join an existing house</button>
              <button className='empty-button' style={{marginLeft: '20px'}} onClick={onNewHouse}>Create a new house</button>
            </div>
            {
            authContext.currentUserDataDb?.invitationsReceivedHouseId && 
            <div className={style.inviteContainer}>
              <p>You have been invited to join a house!</p>
              <div className={style.inviteList}>
                <p className={style.houseNameInvite}>{authContext.currentUserDataDb?.invitationsReceivedHouseId}</p>
                <button className='full-button-small'>Join</button>
              </div>
            </div>
            }
        </div>
      {showModal && modal.current}
    </>
  )
}

export default NoHouse