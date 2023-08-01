import { useHouseContext } from '../../context/HouseContext';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import style from './NoHouse.module.css'
import { useState, useRef, useEffect } from 'react';
import ModalSingleField from '../../components/ModalSingleField/ModalSingleField';
import ModalConfirm from '../../components/ModalConfirm/ModalConfirm';

function NoHouse() {
  const houseContext = useHouseContext();
  const authContext = useAuthContext();
  
  const [showModal, setShowModal] = useState(false)
  const [invites, setInvites] = useState<Map<string, string>>(new Map())
  const [error, setError] = useState<any>()

  const modal = useRef<JSX.Element | null>(null)

  const onNewHouse = () => {
    setShowModal(true)
    modal.current = <ModalSingleField modalTitle={'Create a house!'} fieldHint={'Enter the name of the house'} buttonText={'Create'} setShowModal={setShowModal} updateFunction={houseContext.createHouse}></ModalSingleField>
  }

  const onJoinHouse = () => {
    setShowModal(true)
    modal.current = <ModalSingleField modalTitle={'Join a house!'} fieldHint={'Enter the id of the house'} buttonText={'Join'} setShowModal={setShowModal} updateFunction={houseContext.joinHouse}></ModalSingleField>
  }

  const onAcceptInvite = (houseId: string) => {
    setShowModal(true)
    modal.current = <ModalConfirm title='Are you sure you want to join this house?' setShowModal={setShowModal} updateFunction={ () => houseContext.onAcceptInvitation(houseId)}></ModalConfirm>
   
  }


  useEffect(() => {  
    if (authContext.currentUserDataDb?.invitationsReceivedHouseId) {
      const promises = authContext.currentUserDataDb.invitationsReceivedHouseId.map((valueId) =>
        houseContext.getHouseNameById(valueId).catch((error) => {
          setError(error)
        })
      );
  
      Promise.all(promises).then((values) => {
        const newInvitesMap = new Map<string, string>();
  
        values.forEach((value, index) => {
          if (value) {
            const valueId = authContext.currentUserDataDb!.invitationsReceivedHouseId![index];
            newInvitesMap.set(valueId, value);
          }
        });
  
        setInvites(newInvitesMap);
      });
    }
  }, [authContext.currentUserDataDb?.invitationsReceivedHouseId]);

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
              {
              error ? 
                <p>{error}</p> 
                : 
                (
                  <>
                    <p>You have been invited to join a house!</p>
                    {
                    Array.from(invites).map(([key, value]) => (
                      <div className={style.inviteList} key={key}>
                        <p className={style.houseNameInvite}>{`${value}`}<span className={style.idSpan}>{key}</span></p>
                        <button className='full-button-small' onClick={() => {onAcceptInvite(key)}}>Join</button>
                      </div>
                    ))
                    }
                  </>
                )
              }
              </div>

            }
        </div>
      {showModal && modal.current}
    </>
  )
}

export default NoHouse