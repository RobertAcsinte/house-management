import React from 'react'
import style from './MyHouse.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { Edit } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { ClipLoader } from 'react-spinners'
import Modal from '../../components/ModalEdit/ModalEdit';
import { useHouseContext } from '../../context/HouseContext'



function MyHouse() {

  const houseContext = useHouseContext()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onHouseNameEdit = (name: string) => {
  }

  const modal = useRef<JSX.Element | null>(null)

  return (
    <>
      <Navbar showAllOptions/>
      <div className='top-wrapper'>
      <div className='box-container'>
        <div className='large-title-form'>House info</div>
        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>House Id</div>
          </div>
            <p>{houseContext.houseInfoDb?.id}</p>
        </div>  
        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>House name</div>
              <Edit onClick={() => {onHouseNameEdit("name")}}/>
          </div>
            <p>{houseContext.houseInfoDb?.name}</p>
        </div>  


        {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>:<button className='full-button' style={{width: "50%"}}>Leave</button>}
        <div className='error-text'>{error}</div>
      </div>
      {showModal && modal.current}
    </div>
    </>
  )
}

export default MyHouse