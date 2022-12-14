import React from 'react'
import logo from '../../assests/tinsukia.png';
import './login.css';

export default function LoginBanner() {
  return (
    <div style={{ display: 'flex', flexDirection: "row" }} className='col-md-4 m-3'>
      <img src={logo} alt="Logo" className='w-70' style={{ height: "120px" }} />
      <h5 className='loginTitle'>Tinsukia Commerce College</h5>
    </div>
  )
}
