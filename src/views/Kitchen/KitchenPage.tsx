import Navbar from '../../components/Navbar/Navbar';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import style from './KitchenPage.module.css'
import React from 'react';
import { Add, ArrowBack, ArrowForward } from '@mui/icons-material';
import { MobileTimePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ModalProps from '../../components/ModalTimePicker/ModalTimePicker';
import { AppointmentDb, useAppointmentContext } from '../../context/AppointmentContext';
import { useHouseContext } from '../../context/HouseContext';
import AppointmentBox from '../../components/AppointmentBox/AppointmentBox';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import { ClipLoader } from 'react-spinners';

function KitchenPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>([])
  const [firstDateOfWeekNumber, setFirstDateOfTheWeekNumber] = useState<number>(new Date().getDate())
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const appointmentContext = useAppointmentContext()
  const houseContext = useHouseContext()

  const [showModal, setShowModal] = useState<boolean>(false)
  const modal = useRef<JSX.Element | null>(null)

  const today = new Date() //Wed Aug 02 2023 16:42:49 GMT+0300 (Eastern European Summer Time)
  const firstDateOfWeek = new Date() //Wed Aug 02 2023 16:42:49 GMT+0300 (Eastern European Summer Time)
  const currentDayOfWeek = today.getDay() // Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3...Saturday: 6
  const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1 // Adjust to get Monday as the first day instead of Sunday

  const getWeekDays = (daysFrom: number) => {
    firstDateOfWeek.setDate(firstDateOfWeekNumber - daysSinceMonday + daysFrom) // Get the first day of the week (Monday)

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDateOfWeek)
      currentDate.setDate(firstDateOfWeek.getDate() + i)
      dates.push(currentDate)
    }
    return dates
  };

  const handlePreviousWeekButton = () => {
    setFirstDateOfTheWeekNumber(firstDateOfWeekNumber-7)
    setWeekDates(getWeekDays(-7))
  }

  const handleNextWeekButton = () => {
    setFirstDateOfTheWeekNumber(firstDateOfWeekNumber+7)
    setWeekDates(getWeekDays(7))
  }

  const handleResize = () => {
    if(window.innerWidth <= 865) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  const handleDateButton = (date: Date) => {
    setSelectedDate(date)
  }
  
  const handleAddButton = () => {
    setShowModal(true)
    modal.current = 
    <ModalProps 
      fieldTitle='Make an appoitment' 
      setShowModal={setShowModal}
      setErrorNoAppointments={setError}
      //sends to the time picker modal only the date as in for example '2023-08-08'
      // calendarDate={dayjs(selectedDate).toISOString().slice(0, 10)}
      calendarDate={selectedDate}
     />
  }

  var disabledArrowBack: boolean = false
  if(weekDates.length > 0) {
    if((new Date().getDate() - daysSinceMonday) === weekDates[0].getDate() ) {
      disabledArrowBack = true
    }
  }

  const weekDaysBig = 
    <div className={style.weekContainer}>
      <button disabled={disabledArrowBack} onClick={handlePreviousWeekButton} className={style.buttonDate}>
        <ArrowBack />
      </button>
      {weekDates.map((date, index) => (
        <React.Fragment key={index}>
          {date.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10) ?
            <button key={index} className={style.buttonDate} style={{background: 'var(--orange)'}} onClick={() => handleDateButton(date)}>
              {date.toLocaleDateString(undefined, { weekday: 'short'})}  <p className={style.dateSmall}>{date.toLocaleDateString("de-DE")}</p>
            </button>
            : 
            <>
            {(date.getDate() < new Date().getDate()) && (date.getMonth() === new Date().getMonth()) ? 
              <button disabled key={index} className={style.buttonDate} onClick={() => handleDateButton(date)}>
                {date.toLocaleDateString(undefined, { weekday: 'short'})}  <p className={style.dateSmall}>{date.toLocaleDateString("de-DE")}</p>
              </button>
              :
              <button key={index} className={style.buttonDate} onClick={() => handleDateButton(date)}>
                {date.toLocaleDateString(undefined, { weekday: 'short'})}  <p className={style.dateSmall}>{date.toLocaleDateString("de-DE")}</p>
              </button>
            }
            </>
          }
        </React.Fragment>
      ))}
      <button onClick={handleNextWeekButton} className={style.buttonDate}>
        <ArrowForward />
      </button>
    </div>  

  const weekDaysSmall = 
    <div className={style.weekContainerSmall}>
      <div className={style.arrowContainer}>
        <button disabled={disabledArrowBack} onClick={handlePreviousWeekButton} className={style.buttonDate}>
          <ArrowBack />
        </button>
        <div className={style.dateContainer}>
          {weekDates.length > 0 && (
            <>
              {weekDates[0].toLocaleDateString("de-DE").slice(0, 10)} - {weekDates[weekDates.length-1].toLocaleDateString("de-DE").slice(0, 10)}
            </>
          )}
        </div>
        <button onClick={handleNextWeekButton} className={style.buttonDate}>
          <ArrowForward />
        </button>
      </div>
      <div className={style.daysContainer}>
        {weekDates.map((date, index) => (
          <React.Fragment key={index}>
            {date.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10) ?
              <button key={index} className={style.buttonDate} style={{background: 'var(--orange)'}} onClick={() => handleDateButton(date)}>
                {date.toLocaleDateString(undefined, { weekday: 'narrow'})}
              </button>
              : 
              <>
              {date.getDate() < new Date().getDate() ? 
                <button disabled key={index} className={style.buttonDate} onClick={() => handleDateButton(date)}>
                  {date.toLocaleDateString(undefined, { weekday: 'narrow'})}
                </button>
                :
                <button key={index} className={style.buttonDate} onClick={() => handleDateButton(date)}>
                  {date.toLocaleDateString(undefined, { weekday: 'narrow'})}
                </button>
              }
              </>
            }
          </React.Fragment>
        ))}
      </div>
    </div>  

  useEffect(() => {
    if(window.innerWidth <= 865) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
    setWeekDates(getWeekDays(0))
    window.addEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        await appointmentContext.getAppointments(dayjs(selectedDate).toISOString().slice(0, 10))
        setLoading(false)
        setError(null)
      } catch(error: any) {
        setLoading(false)
        setError(mapFirebaseErrorMessages(error))
      }
    }
    fetchAppointments()
  }, [houseContext.houseInfoDb, selectedDate])

  const appointmentsUI = appointmentContext.appointmentsDb?.map((element) => {
    return (
      <AppointmentBox key={element.id} name={element.userName} startingTime={element.startingTime} endingTime={element.endingTime} />
    )
  })

  return (
    <>
      <Navbar showAllOptions/>
      {isMobile ? weekDaysSmall : weekDaysBig}
      <div className={style.addContainer}>
        <button className='full-button-small' onClick={handleAddButton}>
          Book a timeslot
        </button>
      </div>
      {loading ? 
        <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div> 
        : 
        <>{error ?
          <div className='top-wrapper'><p className='error-text'>{error}</p></div>
          :
          <div className={style.appointmentsContainer}>
            {appointmentsUI}
          </div>
        }</>
      }

      {showModal && modal.current}
    </>
  )
}


export default KitchenPage