import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, styled } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import "./list.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../turf.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Container = styled("div")(({ theme }) => ({
    margin: "60px",
    marginTop: "0px !important",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
}));

export default function PlayerList() {
    const navigate = useNavigate();
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();
    const [bookings, setBookings] = useState([]);

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;

    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
    const ref = useRef({ isMdScreen, settings });

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }

        fetchBookings(); // Fetch bookings when component mounts
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);

    const fetchBookings = async () => {
        const storedUserData = localStorage.getItem('user');
        const user = JSON.parse(storedUserData);
        // console.log(user, "user");
        const tuffOwnerId = user._id;
        const token = localStorage.getItem('token'); // Assuming your token is stored in localStorage under 'token'

        try {
            const response = await axios.post('https://myallapps.tech:3024/api/admin/tuff/BookTuffList', {
                tuffOwnerId // Send user ID in the request body
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the header
                    // 'Content-Type': 'application/json'
                }
            });

            const result = response.data.data.bookTuffData || [];
            setBookings(result);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    return (
        <Container>
            <div className="container1">
                {showSidenav && sidenavMode !== "close" && (
                    <SidenavTheme>
                        <Layout1Sidenav />
                    </SidenavTheme>
                )}
            </div>
            <div className="container2" style={{ width: "82%", float: "right" }}>
                <Button
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: "capitalize" }}
                    onClick={() => navigate(-1)}>
                    Go Back
                </Button>
                <h1 style={{ textAlign: "center" }}> Booking List </h1>
                <br />
                <div className="mt-2 mat-accordion">
                    <div>
                        <table className="mat-elevation-z5 mdc-table">
                            <thead>
                                <tr className="mdc-table-header-row">
                                    <th>Booking ID</th>
                                    <th>Name</th>
                                    <th>Booking Date</th>
                                    <th>Booking Time</th>
                                    <th>Booking Price</th>
                                    <th>Mobile Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((booking) => {
                                    const userData = booking.userData[0]; // Get first user data
                                    const timeData = booking.timeData[0]; // Get first time data
                                    return (
                                        <tr className="mdc-table-row" key={booking._id}>
                                            <td>{booking ? booking._id : 'N/A'}</td>
                                            <td>{userData ? userData.name : 'N/A'}</td>
                                            <td>{new Date(booking.date).toLocaleDateString()}</td>
                                            <td>{timeData ? `${timeData.start_time} - ${timeData.end_time}` : 'N/A'}</td>
                                            <td>{timeData ? timeData.price : 'N/A'}</td>
                                            <td>{userData ? `(${userData.ccode}) ${userData.phone}` : 'N/A'}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr className="mdc-table-row">
                                        <td colSpan="4" style={{ textAlign: 'center' }}>No bookings available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Container>
    );
}
