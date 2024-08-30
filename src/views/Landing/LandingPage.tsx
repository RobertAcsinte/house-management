import NoHouse from '../../assets/nohouse.png';
import Today from '../../assets/today.png';
import Notes from '../../assets/notes.png';
import Appointments from '../../assets/appointments.png';
import Myhouse from '../../assets/myhouse.png';
import FeatureCard from './components/featureCard/FeatureCard'

function LandingPage() {
  return (
    <>
      <FeatureCard 
        title='Effortless communication and coordination among housemates.'
        description='Experience hassle-free student living everywhere in the world with House Sharing! Our platform brings together housemates, making it a breeze to share notes and coordinate schedules for communal spaces. Say goodbye to misunderstandings and hello to seamless housemate harmony!'
      />
      <FeatureCard 
        title='Join a house'
        description='You can create a new house, join an existing house by its id or get invited to one by an already existing user!'
        image={NoHouse}
      />
      <FeatureCard 
        title="See what's going on today"
        description='On the today page, you will always see the pinned notes of the house and the appointments that were made for the current day for the house facilities'
        image={Today}
      />
      <FeatureCard 
        title='Create notes for everyone'
        description='Do you have a package to receive and you want to let others know? Or is there an important announce to be made? Just create a note and it will be available for everyone. The pinned ones will always be on top and on Today page'
        image={Notes}
      />
      <FeatureCard
        title='Make a reservation'
        description='Do you have classes in the morning and you do not know when to wake up to shower so you do not have to wait for others and be late? Or do you want to be sure that when you arrive home you will have time to cook? Book a timeslot. This way everyone can sync in using the shared facilities of the house!'
        image={Appointments}
      />
      <FeatureCard
        title='Manage your house'
        description='You can always manage the house that you are part of. You can change the name of it, add members and see the pending invitations!'
        image={Myhouse}
      />
    </>
  )
}

export default LandingPage