import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { Box, Grid, Drawer, Toolbar, IconButton, Menu } from "@mui/material";
import {
    Main,
    AppBar,
    DrawerHeader,
    MenuBtn,
} from "../../../css/styles";
import swal from "sweetalert";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "../../../css/profile.css";
import logo from '../../../assests/tinsukia.png'

import EmployeeDrawerItem from './FacultyDrawerItem';
import FacultyDashboard from '../FacultyDashboard';
import FacultyAttendance from '../FacultyAttendance';
import AttendanceHistory from '../AttendanceHistory';
import FacultyViewEditProfile from '../FacultyViewEditProfile';

import { DeviceUUID } from 'device-uuid';
import MyBreadcumb from '../../../dashboard/MyBreadcumb';


const drawerWidth = 230;
const transitionDuration = 350;

function FacultyProfile() {
    const uuid = new DeviceUUID().parse();
    const _data = JSON.parse(localStorage.getItem('data'))
    const decoded_data = jwt_decode(_data);


    const [anchorElUser, setAnchorElUser] = useState(null);
    const theme = useTheme();

    const handleLogout = () => {
        swal("Are you sure?", {
            buttons: ["Oh no!", true],
        }).then((value) => {
            if (value === true) {
                localStorage.removeItem("data");
                window.location.href = "/";
            }
        });
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // const classes = useStyles();
    const greaterThan375 = useMediaQuery("(min-width:375px)");
    const [open, setOpen] = React.useState(greaterThan375);

    useEffect(() => {
        if (uuid.platform === "Android" || uuid.platform === "iPhone") {
            setOpen(false)
        } else {
            setOpen(true)
        }

    }, [greaterThan375]);

    const handleMenuClick = () => {
        setOpen(!open);
    };

    return (
        <div>
            <Box sx={{ display: "flex", marginTop: "60px" }}>
                <AppBar
                    position="fixed"
                    open={open}
                    sx={{ backgroundColor: "rgb(19, 71, 129);", zIndex: "980" }} >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            onClick={handleMenuClick}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: "none" }) }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>
                            <Tooltip title="">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Typography
                                        sx={{ color: "rgb(253, 253, 253)", marginRight: "8px", fontSize: "14px", fontFamily: "Montserrat" }}
                                    >
                                        {decoded_data.user.name}
                                    </Typography>
                                    <KeyboardArrowDownIcon sx={{ color: "white" }} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "60px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <MenuBtn
                                        size="small"
                                        variant="text"
                                        color="error"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </MenuBtn>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* DRAWER */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        // zIndex: "980",
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                    transitionDuration={{
                        enter: transitionDuration,
                        exit: transitionDuration,
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader
                        sx={{
                            minWidth: 0,
                            backgroundColor: "rgb(251,251,251)",
                            color: "rgb(19,71,129)",
                        }}
                    >
                        <div className="avatar pt-4">
                            <img src={logo} alt="profile of the user" className="avatar" style={{ filter: 'contrast(1.2)' }} />
                            <div style={{ color: '#2a2a2c', fontWeight: "bold", marginBottom: "13px", textAlign: 'center' }} className="pb-3">Tinsukia Commerce College</div>
                        </div>
                        <IconButton onClick={handleMenuClick}>
                            {theme.direction === "ltr" ? (
                                <ChevronLeftIcon
                                    sx={{
                                        color: "rgb(19,71,129)",
                                        position: 'absolute',
                                        bottom: "40px"
                                    }}
                                />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </DrawerHeader>
                    <div className="drawer-items">
                        <EmployeeDrawerItem uuid={uuid} open={open} setOpen={setOpen} />
                    </div>
                </Drawer>



                {/* irems */}
                <Main open={open}>
                    <Grid item xs={12} sm={12} md={12}>
                        <MyBreadcumb />
                    </Grid>
                    <Routes>
                        <Route path="dashboard" element={<FacultyDashboard />} />
                        <Route path="profile" element={<FacultyViewEditProfile />} />
                        <Route path="attendance" element={<FacultyAttendance />} />
                        <Route path="attendance-history" element={<AttendanceHistory />} />
                    </Routes>
                </Main>
            </Box>
        </div>
    )
}

export default FacultyProfile