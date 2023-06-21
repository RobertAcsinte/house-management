import React from 'react'
import style from './MyHouse.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { Edit } from '@mui/icons-material'
import { useState, useRef } from 'react'
import Modal from '../../components/ModalSingleField/ModalSingleField';
import ModalConfirm from '../../components/ModalConfirm/ModalConfirm'
import { useHouseContext } from '../../context/HouseContext'



function MyHouse() {

  const houseContext = useHouseContext()
  const [showModal, setShowModal] = useState(false)

  const modal = useRef<JSX.Element | null>(null)

  const onHouseNameEdit = () => {
    setShowModal(true)
    modal.current = <Modal modalTitle='New house name' fieldHint='Type the new name for your house' buttonText='Save' setShowModal={setShowModal} updateFunction={houseContext.changeHouseName}></Modal>
  }

  const handleButtonLeave = () => {
    setShowModal(true)
    modal.current = <ModalConfirm title='Are you sure you want to leave?' setShowModal={setShowModal} updateFunction={houseContext.leaveHouse}></ModalConfirm>
  }

  const members = houseContext.houseInfoDb?.users.map((value, index) => {
    const styleColor = index % 2 === 0 ? {background: 'var(--orange-list)', color: 'var(--black)'} : {background: 'var(--black-list)', color: 'var(--white)'}
    return <p className={style.userContainer} style={styleColor} key={value.uid}>{value.name}</p>
  })

  return (
    <>
      <Navbar showAllOptions/>
      <div className='top-wrapper'>
      <div className='box-container'>
        <div className='large-title-form'>House info</div>
        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>Id</div>
          </div>
            <p>{houseContext.houseInfoDb?.id}</p>
        </div>  

        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>Name</div>
              <Edit onClick={onHouseNameEdit}/>
          </div>
            <p>{houseContext.houseInfoDb?.name}</p>
        </div>  

        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>Members</div>
          </div>
            {members}
        </div>  
        <button className='full-button' style={{width: "50%"}} onClick={handleButtonLeave}>Leave</button>
      </div>
      {showModal && modal.current}
    </div>
    </>
  )
}

export default MyHouse