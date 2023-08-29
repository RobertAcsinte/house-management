import { useEffect, useRef, useState } from 'react'
import { useAppointmentContext } from '../../context/AppointmentContext'
import { useAuthContext } from '../../context/AuthContext'
import { useHouseContext } from '../../context/HouseContext'
import style from './AppointmentsToday.module.css'
import { AppointmentType } from '../../AppointmentType'
import AppointmentBox from '../AppointmentBox/AppointmentBox'
import ModalConfirm from '../ModalConfirm/ModalConfirm'
import { ClipLoader } from 'react-spinners'

function AppointmentsToday({ appointmentType }: { appointmentType: AppointmentType }) {
  const appointmentContext = useAppointmentContext()
  const userContext = useAuthContext()
  const houseContext = useHouseContext()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const modal = useRef<JSX.Element | null>(null)


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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        await appointmentContext.getAppointments(appointmentType, new Date().toLocaleDateString("nl-NL"))
        setLoading(false)
      } catch(error: any) {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [houseContext.houseInfoDb])

  const appointments = appointmentType === AppointmentType.bathroom ? appointmentContext.appointmentsDbTodayBathroom : appointmentContext.appointmentsDbTodayKitchen
  const appointmentsUI = appointments?.map((element) => {
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
    {loading ?
      <div className='spinner-button'>
        <ClipLoader color="var(--secondary)" size="50px" />
      </div>
      :
      <>
        {
          appointments ?
            <div className={style.appointmentsContainer}>
              {appointmentsUI}
            </div> :
            <div className={style.empty}>No appointments for today</div>
        }
      </>
    }
    {showModal && modal.current}
  </>
  )

}

export default AppointmentsToday