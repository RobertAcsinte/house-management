import React from 'react'
import style from './MyHouse.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { Edit } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { ClipLoader } from 'react-spinners'
import Modal from '../../components/ModalSingleField/ModalSingleField';
import { useHouseContext } from '../../context/HouseContext'



function MyHouse() {

  const houseContext = useHouseContext()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const modal = useRef<JSX.Element | null>(null)

  const onHouseNameEdit = (name: string) => {
    setShowModal(true)
    modal.current = <Modal modalTitle='New house name' fieldHint='Type the new name for your house' buttonText='Save' setShowModal={setShowModal} updateFunction={houseContext.changeHouseName}></Modal>
  }

  const onButtonClick = () => {
    houseContext.leaveHouse()
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
              <Edit onClick={() => {onHouseNameEdit("name")}}/>
          </div>
            <p>{houseContext.houseInfoDb?.name}</p>
        </div>  

        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>Members</div>
          </div>
            {members}
        </div>  

        {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>:<button className='full-button' style={{width: "50%"}} onClick={onButtonClick}>Leave</button>}
        <div className='error-text'>{error}</div>
      </div>
      {showModal && modal.current}
    </div>
    </>
  )
}

export default MyHouse