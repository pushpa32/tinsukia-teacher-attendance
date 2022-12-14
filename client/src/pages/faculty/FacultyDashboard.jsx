import React, { useState, useEffect } from "react";
import "../../css/profile.css";
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import { Card, Row } from 'antd';


function FacultyDashboard() {

    const [data, setData] = useState("")

    const _data = JSON.parse(localStorage.getItem('data'))
    const decoded_data = jwt_decode(_data);

    const getDetails = async () => {
        const date = moment(new Date()).format("YYYY-MM-DD")

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/dashboard/details"
            : "/api/user/dashboard/details";

        await fetch(URL, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id": decoded_data.user.id,
                "date": date,
                "tokens": _data
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setData(data.data)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };
    useEffect(() => {
        getDetails()
    }, [])


    function redirectToEmp() {
        window.location.href = '/user/attendance'
    }
    function redirectToAttendance() {
        window.location.href = '/user/attendance-history'
    }

    function redirectToProfile() {
        window.location.href = '/user/profile'
    }

    const styles = {
        cardStyle: {
            boxShadow: "1px 2px 1px #9E9E9E"
        }
    };

    return (
        <div>
            <Row style={{ justifyContent: "space-evenly" }}>
                <Card onClick={redirectToEmp} type="inner" hoverable={true} title="Attendance" bordered={false} style={styles.cardStyle} className="card-styles">
                    <p className="profile-num">
                        {data
                            ?
                            <>
                                <p className="profile-num">Registered In:  {data.in_time}</p>
                                <p className="profile-num">Registered Out:  {data.out_time === null ? "--" : data.out_time} </p>
                            </>
                            : "Give your attendance for today"}</p>
                </Card>

                <Card onClick={redirectToAttendance} type="inner" hoverable={true} title="Attendance History" bordered={false} style={styles.cardStyle} className="card-styles">
                    <p className="profile-num">Check your Attendance History Monthly Wise</p>
                </Card>

                <Card onClick={redirectToProfile} type="inner" hoverable={true} title="Profile" bordered={false} style={styles.cardStyle} className="card-styles">
                    <p className="profile-num">Update your Profile!</p>
                </Card>

            </Row>
            <hr />

            {/* <Row style={{ marginTop: "15px", justifyContent: "space-evenly" }}>

                <Card type="inner" hoverable={true} title="Register History (Weekly)" bordered={false} style={styles.cardStyle}>
                    <ColumnPlots />
                </Card>
                <Card type="inner" hoverable={true} title="Total Registered" bordered={false} style={styles.cardStyle}>
                    <PieChart />
                </Card>
            </Row> */}

        </div >
    )
}

export default FacultyDashboard