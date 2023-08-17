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
  setErrorNoAppointments: React.Dispatch<React.SetStateAction<string| null>>,
  calendarDate: Date
}

function ModalTimePicker({fieldTitle, setShowModal, setErrorNoAppointments, calendarDate}: ModalTimePickerType) {

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const startingTime = useRef(calendarDate)
  const endingTime = useRef(new Date(calendarDate.getTime() + 30 * 60 * 1000)); //add 30 mins to the initial ending time by default

  const appointmentContext = useAppointmentContext()

  const handleButtonClick = async () => {
    setLoading(true)
    appointmentContext.createAppointment(startingTime.current, endingTime.current).then(() => {
      setLoading(false)
      setShowModal(false)
      setErrorNoAppointments(null)
    }).catch((error) => {
      setError(mapFirebaseErrorMessages(error.code))
      setLoading(false)
    })
  }

  const handleClose = () => {
    setShowModal(false)
  }
  
  const disablePast = (calendarDate.getDate() === new Date().getDate()) && (calendarDate.getMonth() === new Date().getMonth())

  //the pickers needs the value as a dayjs type and it also gives it as a dayjs type when changed
  const startingTimePicker =      
    <MobileTimePicker
      key={startingTime.current.getTime()}
      label="Starting time"
      disablePast = {disablePast}
      ampm={false}
      slotProps={{ textField: { variant: 'filled' } }}
      value={dayjs(startingTime.current)}
      onChange={(newValue) => {
        const newDate = new Date(calendarDate)
        newDate.setHours(newValue!.hour())
        newDate.setMinutes(newValue!.minute())
        startingTime.current = newDate
      }}
    />
  const endingTimePicker =      
    <MobileTimePicker
      key={endingTime.current.getTime()}
      label="Ending time"
      disablePast = {disablePast}
      ampm={false}
      slotProps={{ textField: { variant: 'filled' } }}
      value={dayjs(endingTime.current)}
      onChange={(newValue) => {
        const newDate = new Date(calendarDate)
        newDate.setHours(newValue!.hour())
        newDate.setMinutes(newValue!.minute())
        endingTime.current = newDate
      }}
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