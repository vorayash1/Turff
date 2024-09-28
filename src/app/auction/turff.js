import 'bootstrap/dist/css/bootstrap.min.css';
import { Fragment, useState, useEffect, useRef } from "react";
import { styled } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import '@grapecity/wijmo.styles/wijmo.css';
import './myauction.css';
import './turf.css';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

export default function Myturff() {
    const navigate = useNavigate();
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();

    const [turfs, setTurfs] = useState([]);  // State to hold the fetched data

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

        fetchTurfs(); // Fetch turfs when component mounts

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);

    const fetchTurfs = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        try {
            const response = await axios.get('https://myallapps.tech:3024/api/admin/tuff/get', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the header
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data.data.tuffData || [];  // Get the tuff data from the response
            setTurfs(result);  // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching turfs:', error);
            toast.error('Failed to fetch turfs.');
        }
    };

    return (
        <>
            <Container>
                <div className="container1">
                    {showSidenav && sidenavMode !== "close" && (
                        <SidenavTheme>
                            <Layout1Sidenav />
                        </SidenavTheme>
                    )}
                </div>
                <div className="container2">
                    <Fragment>
                        <ContentBox className="auction">
                            <h1 style={{ textAlign: "center" }}>Turff List</h1>
                            <div className="">
                                <table className="mat-elevation-z5 mdc-table">
                                    <thead>
                                        <tr className="mdc-table-header-row">
                                            <th>Turff Name</th>
                                            <th>City</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Sport Type</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turfs.length > 0 ? (
                                            turfs.map((turff) => (
                                                <tr className="mdc-table-row" key={turff._id}>
                                                    <td>{turff.name}</td>
                                                    <td>{turff.city}</td>
                                                    <td>{turff.email}</td>
                                                    <td>{turff.phone}</td>
                                                    <td>{turff.sport_type || 'N/A'}</td>
                                                    <td>{turff.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="mdc-table-row">
                                                <td colSpan="6" style={{ textAlign: 'center' }}>No turfs available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </ContentBox>
                    </Fragment>
                </div>
            </Container>
            <ToastContainer />
        </>
    );
}
