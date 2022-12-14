import React, { useEffect, useState } from 'react';
import { authentication } from './config/firebase-config';
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { DeviceUUID } from 'device-uuid';
import logo from '../../assests/tinsukia.png'
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import '../adminLogin/login.css';
import {
    Form,
    Input,
    Button,
} from 'antd';

function FacultyLogin(props) {

    const countryCode = "+91"
    const [expandForm, setExpandForm] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(countryCode)
    const [otp, setOTP] = useState("")
    const uuid = new DeviceUUID().parse();

    //generate recaptcha
    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
            }
        }, authentication);
    }

    //check for phone number in backend after requesting for OTP
    const checkPhoneNumberBackend = async (phone) => {
        let temp = ""

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/rol/check/phone"
            : " /api/rol/check/phone";

        await fetch(URL, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "phone": phone,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log(response)
                    } else {
                        const result = await response.json()
                        if (result.error === false) {
                            setPhoneNumber(phone)
                            temp = "OK"
                        } else {
                            alert(result.message)
                        }
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
        return temp;
    }

    //request for OTP
    const requestOTP = async (value) => {
        // e.preventDefault()

        // if (uuid.platform === "Android" || uuid.platform === "iPhone") {


        //checking phone number in database
        // const device_id = new DeviceUUID().get(); 

        const rData = await checkPhoneNumberBackend(value.phone)
        if (rData != "") {
            if (value.phone.length === 13 || value.phone.length === 10) {

                let phone = "+91" + value.phone

                setExpandForm(true)
                generateRecaptcha()
                let appVerifier = window.recaptchaVerifier
                signInWithPhoneNumber(authentication, phone, appVerifier)
                    .then(confirmationResult => {
                        window.confirmationResult = confirmationResult
                    }).catch((error) => {
                        console.log(error);
                    })
            }
        } else {
            return;
        }

    }

    //user login final
    const userFinalLogin = async () => {

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/rol/otp/login"
            : " /api/rol/otp/login";

        await fetch(URL, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "phone": phoneNumber,
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        alert("Something went wrong!")
                    } else {
                        const result = await response.json()
                        localStorage.setItem("data", JSON.stringify(result));
                        window.location.href = "/user/dashboard"
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    //verify OTP
    const verifyOTP = async (e) => {

        if (otp.length === 6) {
            const confirmationResult = window.confirmationResult
            await confirmationResult.confirm(otp).then((result) => {
                // User signed in successfully.
                const user = result.user;

                // valid phone number and also authenticated by google
                // login the user with token
                userFinalLogin()

            }).catch((error) => {
                alert("Something went wrong, try again!")
            });
        } else alert("Please enter the correct OTP!")
    }
    let decoded_data = ""
    const [isLogedIn, setIsLogedIn] = useState(false)
    const [isUser, setIsUser] = useState()

    const checkLogIn = async () => {
        const logCheck = localStorage.getItem("data");
        if (logCheck != null) {
            setIsLogedIn(true)
            decoded_data = jwt_decode(logCheck)
            setIsUser(decoded_data.user.isUser)

        }
        else setIsLogedIn(false)
    }
    useEffect(() => {
        checkLogIn()
    }, [])

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='adminLogin '>
            {isLogedIn ? (isUser === true ? <Navigate to="/user/dashboard" /> : <Navigate to="/dashboard" />)
                :
                <div className="login col-md-5 col-xs-10">
                    <center>
                        <img src={logo} height="200" width="200" style={{ filter: 'contrast(1.2)' }} />
                    </center>
                    <h3 className="Auth-form-title" style={{ fontSize: 20, marginBottom: 5 }}>Login with your Phone Number</h3>
                    <div className="form-group mt-3">
                        <center>
                            <Form
                                style={{ width: "100%" }}
                                layout="vertical"
                                onFinish={requestOTP}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please provide Phone Number!',
                                        },
                                        {
                                            max: 10,
                                            message: "Phone Number Cannot exceed 10 digits!",
                                        },
                                    ]}
                                >
                                    <Input addonBefore="+91" type='number' style={{ width: '100%' }} />
                                </Form.Item>
                                {/* <input className="form-control mt-1" type='tel' id='phoneNumberInput' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /> */}
                                {expandForm === true ?
                                    <>
                                        <button className="btn btn-success text-white" style={{ fontWeight: "500", fontSize: "12px", cursor: 'pointer', margin: "10px" }} onClick={requestOTP}>resend</button>
                                        <br />
                                        <label>Enter OTP</label>
                                        <p>OTP has been sent to your phone number.</p>
                                        <input type='Number' id='otpInput' value={otp} onChange={(e) => setOTP(e.target.value)} />
                                        <button type="submit" onClick={verifyOTP} className="btn btn-primary" style={{ fontSize: 12, marginLeft: 5 }}>Submit</button>
                                    </> : null}
                                {expandForm === false ? <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Request OTP
                                    </Button>
                                </Form.Item> : null}
                            </Form>
                        </center>
                        <div id='recaptcha-container'></div>
                    </div>
                </div>
            }

        </div >
    );
}

export default FacultyLogin;