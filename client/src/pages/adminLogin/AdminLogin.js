import React, { useState } from "react";
import swal from "sweetalert";
import './login.css';

function AdminLogin() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState({});

    const validation = (e) => {
        e.preventDefault();
        if (email === '' || email === 'undefined') {
            setErr({
                ...err,
                userEmail: true,
            });
            return
        } else if (password === '' || password === 'undefined') {
            setErr({
                ...err,
                passName: true,
                userEmail: false,
            });
            return
        }
        handleSubmit();
    };

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setErr({});

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/rol/admin/login"
            : " /api/rol/admin/login";

        await fetch(URL, {
            method: 'post',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("err")
                    } else {
                        const data = await response.json()
                        if (data.error === true) {
                            swal("Login Failed", data.message);
                        } else {
                            swal("Logged In successfully", {
                                buttons: false,
                                timer: 2000,
                            }).then((value) => {
                                localStorage.setItem("data", JSON.stringify(data.token));
                                window.location.href = "/dashboard";
                            });

                        }
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className="col-md-4">
            <div className="login">
                <form>
                    <p className="h4 mb-3 text-uppercase"><strong>Admin Log In</strong></p>
                    <hr />
                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {err.userEmail && <Error data="Please enter the email address!" />}
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mt-3 mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {err.passName && <Error data="Please enter the password!" />}
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    {/* <div className="checkbox mb-3 my-3">
                        <label>
                            <input
                                type="checkbox"
                            // value={remember}
                            // checked={remember}
                            // onChange={(e) => setRemember(!remember)}
                            />{' '}
                            Remember me
                        </label>
                    </div> */}

                    <button className="w-100 btn btn-lg btn-primary" onClick={validation}>
                        Sign in
                    </button>
                    <p className="mt-3 mb-3 text-muted text-center">&copy; Tinsukia Commerce College 2022</p>
                </form>
            </div>
        </div>
    )
}

export const Error = ({ data }) => {
    return <div style={{ color: 'red', fontSize: '14px', fontWeight: '500' }}>{data}</div>;
};

export default AdminLogin