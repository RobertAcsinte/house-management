import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import style from './KitchenPage.module.css'
import React from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

function KitchenPage() {
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [firstDateOfWeekNumber, setFirstDateOfTheWeekNumber] = useState<number>(new Date().getDate())
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const getWeekDays = (daysFrom: number) => {
    const today = new Date() //Wed Aug 02 2023 16:42:49 GMT+0300 (Eastern European Summer Time)
    const currentDayOfWeek = today.getDay() // Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3...Saturday: 6
    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1 // Adjust to get Monday as the first day instead of Sunday
    
    const firstDateOfWeek = new Date() //Wed Aug 02 2023 16:42:49 GMT+0300 (Eastern European Summer Time)
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
  
  useEffect(() => {
    setWeekDates(getWeekDays(0))
    window.addEventListener("resize", handleResize)
  }, [])


  const weekDaysBig = 
    <div className={style.weekContainer}>
      <button onClick={handlePreviousWeekButton} className={style.buttonDate}>
        <ArrowBack />
      </button>
      {weekDates.map((date, index) => (
        <React.Fragment key={index}>
          {date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ?
            <button key={index} className={style.buttonDate} style={{background: 'var(--orange)'}}>
              {date.toLocaleDateString(undefined, { weekday: 'short'})}  <p>{date.toLocaleDateString()}</p>
            </button>
            : 
            <button key={index} className={style.buttonDate}>
              {date.toLocaleDateString(undefined, { weekday: 'short'})}  <p>{date.toLocaleDateString()}</p>
            </button>
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
        <button onClick={handlePreviousWeekButton} className={style.buttonDate}>
          <ArrowBack />
        </button>
        <div className={style.dateContainer}>
          {weekDates.length > 0 && (
            <>
              {weekDates[0].toLocaleDateString("de-DE").slice(0, 10)} - {weekDates[weekDates.length-1].toISOString().slice(0, 10)}
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
            {date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ?
              <button key={index} className={style.buttonDate} style={{background: 'var(--orange)'}}>
                {date.toLocaleDateString(undefined, { weekday: 'narrow'})}
              </button>
              : 
              <button key={index} className={style.buttonDate}>
                {date.toLocaleDateString(undefined, { weekday: 'narrow'})}
              </button>
            }
          </React.Fragment>
        ))}
      </div>
    </div>  

  return (
    <>
      <Navbar showAllOptions/>
      {isMobile ? weekDaysSmall : weekDaysBig}
    </>
  )
}


export default KitchenPage