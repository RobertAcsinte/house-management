import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useRef, useState } from 'react';
import style from './HomePage.module.css';
import { NoteDataDb, useNotesContext } from '../../context/NotesContext';
import NotesBox from '../../components/NoteBox/NotesBox';
import NoteDetails from '../../components/NoteDetails/NoteDetails';
import NotesToday from '../../components/NotesToday/NotesToday';
import AppointmentsToday from '../../components/AppointmentsToday/AppointmentsToday';
import { AppointmentType } from '../../AppointmentType';
import { ClipLoader } from 'react-spinners';
import { useHouseContext } from '../../context/HouseContext';

function HomePage() {
  const [loading, setLoading] = useState(true)
  const houseContext = useHouseContext()

  useEffect(() => {
    if(houseContext.houseInfoDb?.id !== undefined) {
      setLoading(false)
    }
  }, [houseContext.houseInfoDb])

  return (
    <>
      {loading ? (
        <div className='center-wrapper'>
          <ClipLoader color="var(--secondary)" size="200px" />
        </div>
      ) : (
        <>
          <Navbar showAllOptions />
          <div className={style.wrapper}>
            <div className={style.category}>Pinned Notes</div>
            <NotesToday />
            <div className={style.category}>Kitchen Appointments</div>
            <AppointmentsToday appointmentType={AppointmentType.kitchen} />
            <div className={style.category}>Bathroom Appointments</div>
            <AppointmentsToday appointmentType={AppointmentType.bathroom} />
          </div>
        </>
      )}
    </>
  );
}





export default HomePage