import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useAuthContext } from '../../context/AuthContext';
import style from "./AccountPage.module.css"
import EditIcon from '../../assets/edit_icon.svg';

function AccountPage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;

  return (
    <>
      <Navbar userName={currentUserDataDb?.name}/>

      <div className={style.wrapper}>
      <div className='box-container'>
        <div className='large-title-form'>Account info</div>

        <div className={style.container}>
          <div className={style.editContainer}>
              <div className={style.label}>Name</div>
              <img className={style.editIcon} src={EditIcon} alt="logo" />
          </div>
            <p>{currentUserDataDb.name}</p>
        </div>  

        <div className={style.container}>
          <div className={style.editContainer}>
              <div className={style.label}>Email</div>
              <img className={style.editIcon} src={EditIcon} alt="logo" />
          </div>
            <p>{currentUserDataDb.email}</p>
        </div>  

        <div className={style.container}>
          <div className={style.editContainer}>
              <div className={style.label}>Password</div>
              <img className={style.editIcon} src={EditIcon} alt="logo" />
          </div>
            <p>********</p>
        </div> 

      </div>
    </div>
    </>
  )
}

export default AccountPage