import React, { ReactNode } from 'react'
import style from './ModalTimePicker.module.css'
import { useRef, useState } from 'react'
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import { ClipLoader } from 'react-spinners';
import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAppointmentContext } from '../../context/AppointmentContext';

type ModalTimePickerType =  {
  fieldTitle: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}

function ModalTimePicker({fieldTitle, setShowModal}: ModalTimePickerType) {

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const selectedStartingTime = useRef<any>(dayjs(new Date().getTime()))
  const selectedEndingTime = useRef<any>(dayjs(new Date().getTime()).add(30, 'minute'))

  const appointmentContext = useAppointmentContext()


  const handleButtonClick = async () => {
    setLoading(true)
    await appointmentContext.createAppointment(dayjs(selectedStartingTime.current).toISOString(), dayjs(selectedEndingTime.current).toISOString()).catch((error) => {
      setError(mapFirebaseErrorMessages(error.code))
    })
    setLoading(false)
    setShowModal(false)
  }

  const handleClose = () => {
    setShowModal(false)
  }
  
  const startingTimePicker =      
    <MobileTimePicker
      key={selectedStartingTime.current}
      label="Starting time"
      disablePast
      ampm={false}
      slotProps={{ textField: { variant: 'filled' } }}
      value={selectedStartingTime.current}
      onChange={(newValue) => selectedStartingTime.current = newValue}
    />

  const endingTimePicker =      
    <MobileTimePicker
      key={selectedEndingTime.current}
      label="Ending time"
      disablePast
      ampm={false}
      slotProps={{ textField: { variant: 'filled' } }}
      value={selectedEndingTime.current}
      onChange={(newValue) => selectedEndingTime.current = newValue}
    />

  return (
    <div className={style.wrapper}>
      <div className='center-wrapper' style={{height:"100%"}}>
        <div className={style['box-container-modal']}>
          <button className={style.closeButton} onClick={handleClose}>X</button>
          <div className={style['large-title-modal']}>{fieldTitle}</div>
            {startingTimePicker}
            {endingTimePicker}
          <div className='error-text'>{error}</div>
          <div className={style.buttonsContainer}>
          {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>: <button className='full-button' style={{flex:"1"}} onClick={handleButtonClick}>Book now!</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalTimePicker