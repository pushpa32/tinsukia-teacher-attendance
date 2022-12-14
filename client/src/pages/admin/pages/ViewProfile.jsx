import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Avatar,
} from "@mui/material";
import {
    style3,
    styleGrid,
} from "../../../css/styles";
import "../../../css/profile.css";
import avatar from '../../../assests/avataar.png'
import '../../../css/ViewProfile.css'


const ViewProfile = ({ user_id }) => {

    const [user, setUser] = useState("");
    let [subData, setSubData] = useState([])

    // get individual user details
    const getSingleUserDetails = async () => {
        //get the data
        const _data = await JSON.parse(localStorage.getItem('data'))
        const URL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/get/user"
            : " /api/user/get/user";

        await fetch(URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "tokens": _data,
                "user_id": user_id
            })
        })
            .then(async response => {
                try {
                    if (response.status !== 200) {
                        console.log("Not 200")
                    } else {
                        const data = await response.json()
                        setUser(data.data)
                        setSubData(data.data.subject === null ? [] : JSON.parse(data.data.subject))
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
        getSingleUserDetails()
    }, [])


    return (
        <Box style={style3}>
            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <center>
                        <Avatar
                            className="profile-image"
                            sx={{ height: "120px", width: "120px", marginBottom: "5px", marginTop: "10px" }}
                            alt="profile_image"
                            src={
                                user.profile_img
                                    ? "http://" + user.profile_img
                                    : avatar
                            }
                        />
                        <div className="data mt-3">
                            <h4>Department</h4><span><p>{user.department ? user.department : "NA"}</p></span>
                        </div>
                    </center>
                </Grid>

                <h3 className="header-profile mb-3">Personal Details</h3>
                <Grid container style={styleGrid}>

                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Name</h4>
                            <p>{user.name}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Phone</h4>
                            <p>{user.phone}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Date of Birth</h4>
                            <p>{user.dob ? user.dob : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Gender</h4>
                            <p>{user.gender ? user.gender : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Maritial Status</h4>
                            <p>{user.maritial_status ? user.maritial_status : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Caste</h4>
                            <p>{user.caste ? user.caste : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Highest Qualification</h4>
                            <p>{user.highest_qualification ? user.highest_qualification : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Specialization</h4>
                            <p>{user.specialization ? user.specialization : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Department</h4>
                            <p>{user.department ? user.department : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Subjects</h4>
                            <p>{subData.length != 0 ? subData.map((val, index) => <li key={index}>{val}</li>) : "NA"}</p>
                        </div>
                    </Grid>

                </Grid>


                <h3 className="header-profile mb-3">Address</h3>
                <Grid container style={styleGrid}>

                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Address</h4>
                            <p>{user.address ? user.address : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>District</h4>
                            <p>{user.district ? user.district : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>Pin Code</h4>
                            <p>{user.pin_code ? user.pin_code : "NA"}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <div className="data">
                            <h4>State</h4>
                            <p>{user.state ? user.state : "NA"}</p>
                        </div>
                    </Grid>
                </Grid>

            </Grid>
        </Box >
    )
}

export default ViewProfile