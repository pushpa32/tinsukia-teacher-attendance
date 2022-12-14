import React, { useState, useMemo, useEffect } from "react";
import moment from 'moment';
import swal from "sweetalert";
import "../../css/profile.css"
import jwt_decode from 'jwt-decode';
import { Card, Input, Form, Modal, notification } from 'antd';
import { ColorRing } from "react-loader-spinner"
import registerOut from '../../assests/registerOut.png'
import registerIn from '../../assests/registerIn.png'

const { TextArea } = Input;
const Context = React.createContext({
    name: 'Default',
});

function FacultyAttendance(props) {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, title, bodyMessage) => {
        api.info({
            message: `${title}`,
            description: <Context.Consumer>{({ name }) => `${bodyMessage}`}</Context.Consumer>,
            placement,
            duration: 2,
            // style: { zIndex: "1000" }
        });
    };
    const contextValue = useMemo(
        () => ({
            name: 'Ant Design',
        }),
        [],
    );

    const [spinner, setSpinner] = useState(false)
    const [userData, setUserData] = useState([])
    const [signOut, setSignOut] = useState()
    const [timeToDisplay, setTimeToDisplay] = useState("")
    const [dataHistory, setDataHistory] = useState("")
    const [activity, setActivity] = useState()
    const [visible, setVisible] = useState(false)
    const [distance, setDistance] = useState("dis")

    const [dateDisplay, setDateDisplay] = useState("")

    const [isLate, setIsLate] = useState(false);
    const [lateModal, setLateModal] = useState(false);
    const [lateText, onChangeLateText] = useState("");

    //Register In
    const signInButton = () => {
        // geo location
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        // console.log(result.state);
                        navigator.geolocation.getCurrentPosition(function (position) {
                            const dis = calculateDistance(position.coords.latitude, position.coords.longitude, 27.47107354129472, 95.33768331015403)
                            setDistance(dis)
                        });
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, errors);
                    } else if (result.state === "denied") {
                        alert("You have denied the Location Access!")
                    }
                    result.onchange = function () {
                        console.log(result.state);
                    };
                });
        } else {
            alert("Sorry Not available!");
        }
    }

    const _data = JSON.parse(localStorage.getItem('data'))

    //function for sign in backend
    const signInBackendCall = () => {
        // e.preventDefault()

        if (isLate === false) {
            const timeCheck = moment('11:00am', 'h:mma');
            const now = moment(new Date(), 'h:mma');
            if (now.isBefore(timeCheck)) {
                signInButton()
                setconfirmationVisibility(true)
            }
            else {
                // setIsLate(true)
                setLateModal(true)
                return;
            }
        }

    }


    const finalSubmit = async (stat) => {
        setSpinner(false)
        setconfirmationVisibility(false)
        setLateConfirmationVisibility(false)
        if (lateModal === true) {
            if (lateText === "") {
                setLateModal(false)
                return swal("Fill out Late Reason!")
            }
            else {
                setLateModal(false)
                signInButton()
                setLateConfirmationVisibility(true)
            }
        }

        console.log(lateText);
        console.log(stat);

        try {
            setSpinner(true)
            const data_decoded = jwt_decode(_data)
            const time = moment().format("LTS")

            const URL = window.location.href.startsWith("http://localhost")
                ? "http://localhost:5000/api/attendance/signin"
                : "/api/attendance/signin";

            await fetch(URL, {
                method: "POST",
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "user_id": data_decoded.user.id,
                    "in_time": time,
                    "distance_in": distance,
                    "late_reason": lateText,
                    "late_status": stat,
                    "tokens": _data
                }),
            })
                .then(async response => {
                    try {
                        if (response.status !== 200) {
                            setSpinner(false)
                            console.log("err")
                        } else {
                            setSignOut("")
                            setSpinner(false)
                            openNotification("topRight", "Successful!", "The process is completed with out an error!")
                            getHistoryOfUser()
                        }
                    } catch (err) {
                        console.log(err);
                    };
                })
                .catch(err => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    }

    const [otherVisibility, setOtherVisibility] = useState(false)
    const [otherActivity, setOtherActivity] = useState("")
    const handleChange = (value) => {
        if (value.length === 0) {
            setOtherVisibility(false)
            setOtherActivity("")
        }
        value.forEach(element => {
            if (element.label === "Other") setOtherVisibility(true)
            else {
                setOtherVisibility(false)
                setOtherActivity("")
            }
        }
        );

        setActivity(value);

    };

    //function for sign out backend
    const signOutBackendCall = () => {

        signInButton()

        setSignOutConfiramtion(true)

    }


    const finalSignOut = async () => {
        setSignOutConfiramtion(false)
        try {
            setSpinner(true)

            const data_decoded = jwt_decode(_data)
            const time = moment().format("LTS")
            const date = moment(new Date()).format("YYYY-MM-DD")


            const URL = window.location.href.startsWith("http://localhost")
                ? "http://localhost:5000/api/attendance/signout"
                : "/api/attendance/signout";
            await fetch(URL, {
                method: "POST",
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "user_id": data_decoded.user.id,
                    "out_time": time,
                    'distance_out': distance,
                    "date": date,
                    "tokens": _data
                }),
            })
                .then(async response => {
                    setOtherVisibility(false)
                    try {
                        if (response.status !== 200) {
                            setSpinner(false)
                            console.log("err")
                        } else {
                            setSpinner(false)
                            openNotification("topRight", "Successful!", "The process is completed with out an error!")
                            setVisible(false)
                            getHistoryOfUser()
                        }
                    } catch (err) {
                        console.log(err);
                    };
                })
                .catch(err => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    }

    //If access location popup opens
    function success(position) {
        const dis = calculateDistance(position.coords.latitude, position.coords.longitude, 27.47107354129472, 95.33768331015403)
        setDistance(dis)
        // console.log(`More or less ${crd.accuracy} meters.`);
    }

    function errors(err) {
        alert(`ERROR(${err.code}): ${err.message}`);
    }

    //calculate distance
    function calculateDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit === "K") { dist = dist * 1.609344 }
            if (unit === "N") { dist = dist * 0.8684 }
            // console.log("distance", Math.trunc(dist));
            return dist.toFixed(3) * 1000;
            // return Math.trunc(dist);
        }
    }

    // initially called function to check in and out time for button disability
    const getHistoryOfUser = async () => {
        const data_decoded = jwt_decode(_data)
        const date = moment(new Date()).format("YYYY-MM-DD")


        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/attendance/history/by/id"
            : "/api/attendance/history/by/id";

        await fetch(URL, {
            method: "POST",
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user_id": data_decoded.user.id,
                "date": date,
                "tokens": _data
            }),
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("err")
                    } else {
                        const result = await response.json();
                        if (result.data.length !== 0) setUserData(result.data[0]);

                        (result.data.length === 0 ? setTimeToDisplay("-") : setTimeToDisplay(result.data[0].in_time));
                        (result.data.length === 0 ? setSignOut("-") : setSignOut(result.data[0].out_time));
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });

    }

    useEffect(() => {
        const displayDate = moment(new Date()).format('LL')
        setDateDisplay(displayDate)

        getHistoryOfUser()

        signInButton()
    }, [])

    const styles = {
        signInPop: {
            fontSize: dataHistory === "" ? "19px" : dataHistory === null ? "15px" : "19px",
            backgroundColor: 'green',
            color: "white"
        },
        signOutPop: {
            fontSize: dataHistory === "" ? "15px" : dataHistory === null ? "19px" : "15px",
            backgroundColor: '#FF5733',
            color: "white"
        }
    };

    const [confirmationVisibility, setconfirmationVisibility] = useState(false)
    const [LateConfirmationVisibility, setLateConfirmationVisibility] = useState(false)
    const [signOutConfiramtion, setSignOutConfiramtion] = useState(false)

    return (
        <>
            <Context.Provider value={contextValue}>
                {contextHolder}

                {/* Late Modal */}
                <Modal
                    title="Reason for Late!!"
                    open={lateModal}
                    onOk={finalSubmit}
                    onCancel={() => setLateModal(false)}
                    okText="Submit"
                    cancelText="cancel">
                    <Form.Item>
                        <TextArea rows={4}
                            value={lateText} onChange={(e) => onChangeLateText(e.target.value)}
                        />
                    </Form.Item>

                </Modal>

                <Modal
                    title="Your distance from college!"
                    open={LateConfirmationVisibility}
                    onOk={() => {
                        // setLateModal(false)
                        finalSubmit(0)
                    }}
                    onCancel={() => setLateConfirmationVisibility(false)}
                    okText="ok"
                    cancelText="cancel">

                    <Card>
                        <div>You are {distance} mtrs away from Compound!</div>
                    </Card>

                </Modal>


                <Modal
                    title="Your distance from college!"
                    open={confirmationVisibility}
                    onOk={() => {
                        finalSubmit(1)
                    }}
                    onCancel={() => setconfirmationVisibility(false)}
                    okText="ok"
                    cancelText="cancel">

                    <Card>
                        <div>You are {distance} mtrs away from Compound!</div>
                    </Card>

                </Modal>

                <Modal
                    title="Your distance from college"
                    open={signOutConfiramtion}
                    onOk={finalSignOut}
                    onCancel={() => setSignOutConfiramtion(false)}
                    okText="ok"
                    cancelText="cancel">

                    <Card>
                        <div>You are {distance} mtrs away from Compound!</div>
                    </Card>

                </Modal>

                <h5><p>Attendance for Today!</p></h5>
                {dateDisplay}


                <center>
                    {
                        userData.length === 0 ?
                            <div className="">
                                <img src={registerIn} className="register-button" onClick={signInBackendCall} style={{ position: "relative", zIndex: "1000" }} />
                                <p style={{ marginTop: "10px", color: "black", fontSize: "15px", fontWeight: "500" }}>Register In</p>
                            </div>

                            :
                            signOut === null ?
                                <div class="">
                                    <img src={registerOut} className="register-button" onClick={signOutBackendCall} style={{ position: "relative", zIndex: "1000" }} />
                                    <p style={{ marginTop: "10px", color: "black", fontSize: "15px", fontWeight: "500" }}>Register Out</p>
                                </div>
                                :
                                <p>You have registered for today!</p>
                    }
                </center>

                <center>
                    <ColorRing
                        visible={spinner}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
                </center>

                <center>
                    <div
                        style={{ marginTop: "20px" }}
                    >
                        <Card type="inner" hoverable={true} title="Check In Time" bordered={false} className="width-attendance">
                            <p style={{
                                fontWeight: "600"
                            }}>
                                Sign In:{timeToDisplay === "" ? "-" : ` ${timeToDisplay}`}
                            </p>
                            <p style={{
                                fontWeight: "600",
                                marginTop: "15px"
                            }}>
                                Sign Out:{signOut === "" ? "-" : ` ${signOut}`}
                            </p>
                        </Card>
                    </div>
                </center>
            </Context.Provider>
        </>
    );
}

export default FacultyAttendance;