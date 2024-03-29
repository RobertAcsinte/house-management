import Navbar from '../../components/Navbar/Navbar';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import style from './AppointmentsPage.module.css'
import React from 'react';
import { Add, AddCircle, ArrowBack, ArrowForward } from '@mui/icons-material';
import { MobileTimePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ModalProps from '../../components/ModalTimePicker/ModalTimePicker';
import { AppointmentDb, useAppointmentContext } from '../../context/AppointmentContext';
import { useHouseContext } from '../../context/HouseContext';
import AppointmentBox from '../../components/AppointmentBox/AppointmentBox';
import mapErrorMessages from '../../mapErrorMessages';
import { ClipLoader } from 'react-spinners';
import { AppointmentType } from '../../AppointmentType';
import { useAuthContext } from '../../context/AuthContext';
import ModalConfirm from '../../components/ModalConfirm/ModalConfirm';

function AppointmentsPage({ appointmentType }: { appointmentType: AppointmentType }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>([])
  const [firstDateOfWeekNumber, setFirstDateOfTheWeekNumber] = useState<number>(new Date().getDate())
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  

  const appointmentContext = useAppointmentContext()
  const userContext = useAuthContext()
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
    if(window.innerWidth <= 775) {
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
      calendarDate={selectedDate}
      appointmentType={appointmentType}
     />
  }

  const onDeleteButton = (appointmentType: AppointmentType, date: Date, id: string) => {
    setShowModal(true)
    modal.current = 
      <ModalConfirm 
        title='Are you sure you want to cancel this appointment?' 
        setShowModal={setShowModal} 
        updateFunction={() => {
          return appointmentContext.deleteAppointment(appointmentType, date, id)
        }}
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
      {disabledArrowBack ? <div className={style.arrowsDisabled}><ArrowBack /></div> : <div className={style.arrows} onClick={handlePreviousWeekButton}><ArrowBack /></div>}
      {weekDates.map((date, index) => (
        <React.Fragment key={index}>
          {date.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10) ?
            <div key={index} className={style.dateContainer} onClick={() => handleDateButton(date)}>
              <span>{date.toLocaleDateString(undefined, { weekday: 'short'})}</span> <div className={style.dateSmallSelected}>{date.getDate()}/{date.getMonth()+1}</div>
            </div>
            : 
            <>
            {(date.getDate() < new Date().getDate()) && (date.getMonth() === new Date().getMonth()) ? 
              <div key={index} className={style.dateContainerDisabled}>
                {date.toLocaleDateString(undefined, { weekday: 'short'})}  <p className={style.dateSmallDisabled}>{date.getDate()}/{date.getMonth()+1}</p>
              </div>
              :
              <div key={index} className={style.dateContainer} onClick={() => handleDateButton(date)} id="dateContainer">
                <span>{date.toLocaleDateString(undefined, { weekday: 'short'})}</span> <p id="dateSmall" className={style.dateSmall}>{date.getDate()}/{date.getMonth()+1}</p>
              </div>
            }
            </>
          }
        </React.Fragment>
      ))}
      <div className={style.arrows} onClick={handleNextWeekButton}><ArrowForward /></div>
    </div>  

  const weekDaysSmall = 
    <div className={style.weekContainerSmall}>
      <div className={style.arrowContainer}>
      {disabledArrowBack ? <div className={style.arrowsDisabled}><ArrowBack /></div> : <div className={style.arrows} onClick={handlePreviousWeekButton}><ArrowBack /></div>}
        <div className={style.dateContainerMobile}>
          {weekDates.length > 0 && (
            <>
              {weekDates[0].toLocaleDateString("de-DE").slice(0, 10)} - {weekDates[weekDates.length-1].toLocaleDateString("de-DE").slice(0, 10)}
            </>
          )}
        </div>
        <div className={style.arrows} onClick={handleNextWeekButton}><ArrowForward /></div>
      </div>
      <div className={style.daysContainerMobile}>
        {weekDates.map((date, index) => (
          <React.Fragment key={index}>
            {date.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10) ?
              <button key={index} className={style.buttonDate} style={{background: 'var(--secondary)', color:'var(--background)'} } onClick={() => handleDateButton(date)}>
                {date.toLocaleDateString(undefined, { weekday: 'narrow'})}
              </button>
              : 
              <>
              {(date.getDate() < new Date().getDate()) && (date.getMonth() === new Date().getMonth()) ? 
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

  //this will run initially and every time the date is changed
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        await appointmentContext.getAppointments(appointmentType, selectedDate.toLocaleDateString("nl-NL"))
        setLoading(false)
      } catch(error: any) {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [houseContext.houseInfoDb, selectedDate, appointmentType])

  const appointmentsUI = appointmentContext.appointmentsDb?.map((element) => {
    return (
      <AppointmentBox
        background = {appointmentType === AppointmentType.bathroom ? "var(--bathroom)" : "var(--kitchen)"}
        key={element.id} 
        name={element.userId === userContext.currentUser?.uid ? "You" : element.userName}
        userId={element.userId}
        startingTime={element.startingTime} 
        endingTime={element.endingTime}
        showRemove={element.userId === userContext.currentUser?.uid }
        removeAppointment={() => onDeleteButton(appointmentType, new Date(element.startingTime), element.id)}
      />
    )
  })

  return (
    <>
    
      <Navbar showAllOptions/>
      {isMobile ? weekDaysSmall : weekDaysBig}
      <div className='wrapper-content'>
        <div className={style.addContainer}>
          <button className='full-button-small' onClick={handleAddButton}>
            Book a timeslot
          </button>
        </div>
        {loading ?
          <div className='spinner-button'>
            <ClipLoader color="var(--secondary)" size="200px" />
          </div>
          :
          <>
            {appointmentContext.error ?
              <div className='error-wrapper'>
                {appointmentContext.error}
              </div>
              :
              <div className={style.appointmentsContainer}>
                {appointmentsUI}
              </div>   
            }
          </>
        }
        {showModal && modal.current}
      </div>
    </>
  )
}


export default AppointmentsPage