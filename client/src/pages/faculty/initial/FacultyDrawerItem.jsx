import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import {
    Divider,
    List,
    ListItemIcon,
    ListItemText,
    CardHeader,
} from "@mui/material";

import "../../../css/profile.css";
import { LightTooltip } from "../../../css/styles";

import ListItemButton from "@mui/material/ListItemButton";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useLocation } from "react-router-dom";


function FacultyDrawerItem({ uuid, open, setOpen }) {
    const [link, setLink] = React.useState("dashboard");
    const location = useLocation();

    useEffect(() => {
        const path = window.location.pathname.split("/");
        setLink(path[path.length - 1]);
    }, [location]);

    const checkDrawerOpenClose = () => {
        (uuid.platform === "Android" || uuid.platform === "iPhone") ? setOpen(!open) : setOpen(true)
    }

    return (
        <List className="list-main">
            <div className="list-d">
                <div>
                    {/* Employees */}
                    <Link style={{ textDecoration: 'none' }} to="dashboard" onClick={() => checkDrawerOpenClose()}>
                        <LightTooltip title="Dashboard" placement="right">
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    backgroundColor:
                                        link === "dashboard" ? "#658CBB" : "transparent",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: "cyan",
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <DashboardCustomizeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: "rgb(250, 250, 250)",
                                    }}
                                >
                                    Dashboard
                                </ListItemText>
                            </ListItemButton>
                        </LightTooltip>
                    </Link>

                    <Link style={{ textDecoration: 'none' }} to="profile" onClick={() => checkDrawerOpenClose()}>
                        <LightTooltip title="Profile" placement="right">
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    backgroundColor:
                                        link === "profile" ? "#658CBB" : "transparent",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: "cyan",
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <AccountBoxOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: "rgb(250, 250, 250)",
                                    }}
                                >
                                    Profile
                                </ListItemText>
                            </ListItemButton>
                        </LightTooltip>
                    </Link>

                    <Link style={{ textDecoration: 'none' }} to="attendance" onClick={() => checkDrawerOpenClose()}>
                        <LightTooltip title="Attendance" placement="right">
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    backgroundColor:
                                        link === "attendance" ? "#658CBB" : "transparent",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: "cyan",
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: "rgb(250, 250, 250)",
                                    }}
                                >
                                    Attendance
                                </ListItemText>
                            </ListItemButton>
                        </LightTooltip>
                    </Link>

                    <Link style={{ textDecoration: 'none' }} to="attendance-history" onClick={() => checkDrawerOpenClose()}>
                        <LightTooltip title="History" placement="right">
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    backgroundColor:
                                        link === "attendance-history" ? "#658CBB" : "transparent",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: "cyan",
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ReceiptLongIcon />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: "rgb(250, 250, 250)",
                                    }}
                                >
                                    History
                                </ListItemText>
                            </ListItemButton>
                        </LightTooltip>
                    </Link>

                    {/* <div className='close-btn'>
                        <ChevronLeftIcon
                            sx={{
                                color: "white",
                            }}
                        />
                    </div> */}

                </div>
            </div>
        </List>
    )
}

export default FacultyDrawerItem