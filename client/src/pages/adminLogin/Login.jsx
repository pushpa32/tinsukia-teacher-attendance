import React from 'react'
import AdminLogin from './AdminLogin'
import LoginBanner from './LoginBanner'
import './loginPage.css';

const Login = () => {
    return (
        <div className='loginPage'>
            <div className=' w-100'>
                <div className='box row'>
                    <LoginBanner />
                    <AdminLogin />
                </div>
            </div>
        </div>
    )
}

export default Login