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
  calendarDate: string
}

function ModalTimePicker({fieldTitle, setShowModal, setErrorNoAppointments, calendarDate}: ModalTimePickerType) {

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  //gets the calendarDate props which is in the format of '2023-08-08' then it adds a T
  //then it gets the current time to ISO string, which is like 2023-08-08T12:10:23.105Z, and then it's slicing it to only get the 12:10:23.105Z part
  //this way it gets the selected date from the slider and the selected time from the picker, bc the selected time from the picker only gives the current date
  const formattedStartingTime = useRef(calendarDate + "T" + dayjs(new Date().getTime()).toISOString().slice(dayjs(new Date().getTime()).toISOString().indexOf("T") + 1))
  const formattedEndingTime = useRef(calendarDate + "T" + dayjs(dayjs(new Date().getTime()).add(30, 'minute')).toISOString().slice(dayjs(dayjs(new Date().getTime()).add(30, 'minute')).toISOString().indexOf("T") + 1))

  const appointmentContext = useAppointmentContext()

  const handleButtonClick = async () => {
    setLoading(true)
    await appointmentContext.createAppointment(formattedStartingTime.current, formattedEndingTime.current).catch((error) => {
      setError(mapFirebaseErrorMessages(error.code))
    })
    setLoading(false)
    setShowModal(false)
    setErrorNoAppointments(null)
  }

  const handleClose = () => {
    setShowModal(false)
  }
  

  //the pickers needs the value as a dayjs type and it also gives it as a dayjs type when changed
  const startingTimePicker =      
    <MobileTimePicker
      key={formattedStartingTime.current}
      label="Starting time"
      disablePast
      ampm={false}
      slotProps={{ textField: { variant: 'filled' } }}
      value={dayjs(new Date(formattedStartingTime.current))}
      onChange={(newValue) => {
        const time = dayjs(newValue).toISOString().slice(dayjs(newValue).toISOString().indexOf("T") + 1)
        const formattedDateAppointment = calendarDate + "T" + time
        formattedStartingTime.current = formattedDateAppointment
      }}
    />
  const endingTimePicker =      
    <MobileTimePicker
      key={formattedEndingTime.current}
      label="Ending time"
      disablePast
      ampm={false}
      slotProps={{ textField: { variant: 'filled' } }}
      value={dayjs(new Date(formattedEndingTime.current))}
      onChange={(newValue) => {
        const time = dayjs(newValue).toISOString().slice(dayjs(newValue).toISOString().indexOf("T") + 1)
        const formattedDateAppointment = calendarDate + "T" + time
        formattedEndingTime.current = formattedDateAppointment
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