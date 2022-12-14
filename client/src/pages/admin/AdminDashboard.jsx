import React, { useState, useEffect } from "react";
import "../../css/profile.css";
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import { Card, Col, Row } from 'antd';
import CircleLiquidPercent from "../../graphs/CircleLiquidPercent";
import ColumnPlots from "../../graphs/ColumnPlots";
import PieChart from "../../graphs/PieChart";

const AdminDashboard = () => {


    function redirectToTeachers() {
        window.location.href = '/dashboard/teachers'
    }

    function redirectToAttendance() {
        window.location.href = '/dashboard/teachers/attendance'
    }
    function redirectToRegitration() {
        window.location.href = '/dashboard/teachers/registration'
    }

    const styles = {
        cardStyle: {
            boxShadow: "1px 2px 1px #9E9E9E"
        }
    };

    const [data, setData] = useState()

    const _data = JSON.parse(localStorage.getItem('data'))
    const getDetails = async () => {
        const date = moment(new Date()).format("YYYY-MM-DD")

        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/admin/dashboard/details"
            : "/api/user/admin/dashboard/details";

        await fetch(URL, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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

    return (
        <div>
            <Row style={{ justifyContent: "space-evenly" }}>
                <Card onClick={redirectToTeachers} type="inner" hoverable={true} title="Total Employees" bordered={false} style={styles.cardStyle} className="card-styles">
                    <p className="profile-num">Registered Users:  {data ? (data[0].length === 0 ? "No User" : data[0].length) : "Loading......"}</p>
                </Card>

                <Card onClick={redirectToAttendance} type="inner" hoverable={true} title="Today's Attendance" bordered={false} style={styles.cardStyle} className="card-styles">
                    <p className="profile-num">Attendance given by:  {data ? data[1].length === 0 ? "Not Yet" : data[1].length + " users" : "Loading......"}</p>
                </Card>

                <Card onClick={redirectToRegitration} type="inner" hoverable={true} title="Register New User" bordered={false} style={styles.cardStyle} className="card-styles">
                    <p className="profile-num">Newly Added Teacher Today:  {data ? data[2].length === 0 ? "0" : data[2].length : "Loading......"}</p>
                </Card>

            </Row>
        </div>
    )
}

export default AdminDashboard